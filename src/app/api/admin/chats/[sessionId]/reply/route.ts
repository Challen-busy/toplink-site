import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { adminReplySchema } from "@/lib/validators-chat";

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await ctx.params;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = adminReplySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const session = await db.chatSession.findUnique({
    where: { id: sessionId },
  });
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const message = await db.chatMessage.create({
    data: {
      sessionId,
      role: "human",
      content: parsed.data.content,
    },
  });

  // Update status to HUMAN if it was HANDOFF
  if (session.status === "HANDOFF" || session.status === "AI") {
    await db.chatSession.update({
      where: { id: sessionId },
      data: { status: "HUMAN" },
    });
  }

  return NextResponse.json({ ok: true, id: message.id });
}
