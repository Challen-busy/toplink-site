import { db } from "@/lib/db";
import { openai } from "@/lib/openai";
import {
  buildSystemPrompt,
  buildMessages,
  chatTools,
  executeSearchProducts,
} from "@/lib/chat";
import { chatMessageSchema } from "@/lib/validators-chat";
import { sendHandoffNotification } from "@/lib/chat-email";
import crypto from "node:crypto";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = chatMessageSchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return Response.json(
      { error: first?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { message, pageUrl } = parsed.data;
  let sessionId = parsed.data.sessionId ?? undefined;

  const ipHeader =
    req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "";
  const visitorIp = ipHeader
    ? crypto.createHash("sha256").update(ipHeader).digest("hex").slice(0, 24)
    : null;
  const userAgent = req.headers.get("user-agent") ?? null;

  // Create or fetch session
  let session;
  if (sessionId) {
    session = await db.chatSession.findUnique({ where: { id: sessionId } });
  }
  if (!session) {
    session = await db.chatSession.create({
      data: { visitorIp, userAgent, pageUrl },
    });
    sessionId = session.id;
  }

  // If session is CLOSED, reject
  if (session.status === "CLOSED") {
    return Response.json(
      { error: "This conversation has been closed." },
      { status: 400 },
    );
  }

  // Save visitor message
  await db.chatMessage.create({
    data: { sessionId: session.id, role: "visitor", content: message },
  });

  // Build OpenAI messages
  const systemPrompt = await buildSystemPrompt();
  const messages = await buildMessages(session.id, systemPrompt);

  // Stream response
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      function send(data: Record<string, unknown>) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
        );
      }

      try {
        const stream = await openai.chat.completions.create({
          model: "gpt-4o",
          messages,
          tools: chatTools,
          stream: true,
        });

        let fullContent = "";
        let toolCallId = "";
        let toolCallName = "";
        let toolCallArgs = "";

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta;
          if (!delta) continue;

          // Text content
          if (delta.content) {
            fullContent += delta.content;
            send({ delta: delta.content });
          }

          // Tool call accumulation
          if (delta.tool_calls && delta.tool_calls.length > 0) {
            const tc = delta.tool_calls[0];
            if (tc.id) toolCallId = tc.id;
            if (tc.function?.name) toolCallName = tc.function.name;
            if (tc.function?.arguments) toolCallArgs += tc.function.arguments;
          }
        }

        // Execute tool call if any
        if (toolCallName) {
          let toolArgs: Record<string, string> = {};
          try {
            toolArgs = JSON.parse(toolCallArgs);
          } catch {
            /* ignore parse errors */
          }

          let toolResult = "";

          if (toolCallName === "search_products") {
            send({ thinking: "Searching products..." });
            toolResult = await executeSearchProducts(
              toolArgs.query ?? "",
            );
          } else if (toolCallName === "request_handoff") {
            const reason = toolArgs.reason ?? "Customer requested human agent";

            // Update session status
            await db.chatSession.update({
              where: { id: session.id },
              data: { status: "HANDOFF" },
            });

            // Save system message
            await db.chatMessage.create({
              data: {
                sessionId: session.id,
                role: "system",
                content: `Transferring to human agent: ${reason}`,
              },
            });

            // Send email notification (fire & forget)
            sendHandoffNotification({
              sessionId: session.id,
              reason,
              visitorMessage: message,
              language: session.language,
              pageUrl: session.pageUrl,
            }).catch((err) =>
              console.error("[chat] handoff email error", err),
            );

            send({
              handoff: true,
              reason,
              message:
                "I'm connecting you with a human agent who can help further. They'll be with you shortly.",
            });
            send({ done: true, sessionId: session.id });

            // Save the handoff message as AI message
            await db.chatMessage.create({
              data: {
                sessionId: session.id,
                role: "ai",
                content:
                  "I'm connecting you with a human agent who can help further. They'll be with you shortly.",
                toolCall: JSON.stringify({
                  name: "request_handoff",
                  args: toolArgs,
                }),
              },
            });

            controller.close();
            return;
          }

          // Follow-up call with tool result
          const followUpMessages = [
            ...messages,
            {
              role: "assistant" as const,
              content: fullContent || null,
              tool_calls: [
                {
                  id: toolCallId,
                  type: "function" as const,
                  function: {
                    name: toolCallName,
                    arguments: toolCallArgs,
                  },
                },
              ],
            },
            {
              role: "tool" as const,
              tool_call_id: toolCallId,
              content: toolResult,
            },
          ];

          const followUp = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: followUpMessages,
            stream: true,
          });

          fullContent = ""; // reset for follow-up
          for await (const chunk of followUp) {
            const delta = chunk.choices[0]?.delta;
            if (delta?.content) {
              fullContent += delta.content;
              send({ delta: delta.content });
            }
          }
        }

        // Save full AI message
        if (fullContent) {
          await db.chatMessage.create({
            data: {
              sessionId: session.id,
              role: "ai",
              content: fullContent,
              toolCall: toolCallName
                ? JSON.stringify({ name: toolCallName, args: toolCallArgs })
                : null,
            },
          });

          // Auto-detect language from first AI reply & update session
          if (!session.language) {
            await db.chatSession.update({
              where: { id: session.id },
              data: {
                language: detectLanguage(message),
                summary: message.slice(0, 120),
              },
            });
          }
        }

        send({ done: true, sessionId: session.id });
      } catch (err) {
        console.error("[chat] stream error", err);
        send({
          error: "Sorry, something went wrong. Please try again.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Session-Id": sessionId!,
    },
  });
}

function detectLanguage(text: string): string {
  // Simple heuristic: if text contains CJK characters, mark as zh; otherwise en
  const cjkRegex = /[\u4e00-\u9fff\u3400-\u4dbf]/;
  if (cjkRegex.test(text)) return "zh";
  const jpRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
  if (jpRegex.test(text)) return "ja";
  const krRegex = /[\uac00-\ud7af]/;
  if (krRegex.test(text)) return "ko";
  return "en";
}
