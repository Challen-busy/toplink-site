import type { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources/chat/completions";
import { db } from "./db";

// ── System prompt ──────────────────────────────────────────

export async function buildSystemPrompt(): Promise<string> {
  const settings = await db.siteSettings.findUnique({
    where: { id: "default" },
  });

  const categories = await db.category.findMany({
    where: { level: 1 },
    orderBy: { sortOrder: "asc" },
    include: {
      children: {
        orderBy: { sortOrder: "asc" },
        select: { nameEn: true },
      },
    },
  });

  const catalogSummary = categories
    .map(
      (c) =>
        `- ${c.nameEn}: ${c.children.map((s) => s.nameEn).join(", ")}`,
    )
    .join("\n");

  return `You are a helpful sales consultant for ${settings?.companyName ?? "TopLink Electronics"}, a contract manufacturer of custom cable assemblies and wire harnesses based in Dongguan, China.

Company information:
- ${settings?.tagline ?? "Custom cable and wire harness manufacturing, built to your spec."}
- Phone: ${settings?.phone ?? ""} / ${settings?.phone2 ?? ""}
- Email: ${settings?.email1 ?? ""} / ${settings?.email2 ?? ""}
- Address: ${settings?.address ?? ""}

Key facts:
- We can manufacture ANY type of cable or harness assembly — we are NOT limited to what is listed on our website. If a customer asks about something not in our catalog, tell them we can custom-build it to their specification.
- IPC/WHMA-A-620 certified (Class 2 and Class 3), ISO 9001
- 20+ years OEM experience serving automotive, medical, industrial, and telecom customers in 30+ countries
- Two facilities: Dongguan (main) and Wujiang
- Capabilities: NPI, DfM analysis, AutoCAD design, first article verification, BOM development, 100% electrical testing

Product catalog overview (${categories.length} main categories):
${catalogSummary}

Use the search_products tool to find specific products when the customer asks. Do NOT guess specifications — use the tool or say you will have an engineer follow up.

Rules:
- CRITICAL: Detect the visitor's language from their message and ALWAYS respond in that same language. If they write in Chinese, respond in Chinese. If English, respond in English. Match their language exactly.
- Be concise, friendly, and professional — like an experienced program manager.
- Guide the conversation toward understanding their needs: cable type, industry/application, quantity, timeline.
- When you have enough information, suggest they submit a formal RFQ via the website or offer to connect them with a human agent.
- Keep responses under 200 words unless the customer asks for detailed technical information.

Transfer to human (call request_handoff tool) when:
- The visitor explicitly asks for a human agent
- They ask about pricing, quotation, or unit cost (we don't share prices via AI)
- They mention technical drawings, datasheets, or files that need review
- You are unable to help after 2 attempts
- The conversation involves complex multi-product or large-volume program discussions`;
}

// ── Tool definitions ───────────────────────────────────────

export const chatTools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_products",
      description:
        "Search TopLink's product catalog by keyword. Returns matching products with name, summary, category, and website URL.",
      parameters: {
        type: "object" as const,
        properties: {
          query: {
            type: "string",
            description:
              "Search keyword, e.g. 'automotive harness', 'M12 sensor cable', 'silicone medical cable'",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "request_handoff",
      description:
        "Transfer the conversation to a human agent. Call this when the visitor needs human assistance for pricing, quotes, technical drawing review, or explicitly asks for a human.",
      parameters: {
        type: "object" as const,
        properties: {
          reason: {
            type: "string",
            description:
              "Brief reason for handoff, e.g. 'pricing request', 'technical drawing review', 'customer requested human'",
          },
        },
        required: ["reason"],
      },
    },
  },
];

// ── Tool execution ─────────────────────────────────────────

export async function executeSearchProducts(
  query: string,
): Promise<string> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://toplink.observer";

  const products = await db.product.findMany({
    where: {
      published: true,
      OR: [
        { nameEn: { contains: query, mode: "insensitive" } },
        { summary: { contains: query, mode: "insensitive" } },
        {
          category: {
            OR: [
              { nameEn: { contains: query, mode: "insensitive" } },
              { parent: { nameEn: { contains: query, mode: "insensitive" } } },
            ],
          },
        },
      ],
    },
    take: 5,
    include: { category: { include: { parent: true } } },
  });

  if (products.length === 0) {
    return "No exact matches found in our current catalog. However, TopLink can custom-manufacture virtually any cable or harness assembly to specification. Ask the customer for more details about their requirements.";
  }

  return products
    .map((p) => {
      const l1Slug = p.category?.parent?.slug ?? "";
      const l2Slug = p.category?.slug ?? "";
      const url = `${siteUrl}/products/${l1Slug}/${l2Slug}/${p.slug}`;
      return `- ${p.nameEn} (${p.category?.parent?.nameEn} / ${p.category?.nameEn}): ${p.summary}. Details: ${url}`;
    })
    .join("\n");
}

// ── Message builder ────────────────────────────────────────

export async function buildMessages(
  sessionId: string,
  systemPrompt: string,
): Promise<ChatCompletionMessageParam[]> {
  const dbMessages = await db.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    take: 40, // last 40 messages max for context window
  });

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
  ];

  for (const m of dbMessages) {
    if (m.role === "visitor") {
      messages.push({ role: "user", content: m.content });
    } else if (m.role === "ai") {
      messages.push({ role: "assistant", content: m.content });
    } else if (m.role === "human") {
      messages.push({
        role: "assistant",
        content: `[Human agent]: ${m.content}`,
      });
    } else if (m.role === "system") {
      messages.push({ role: "system", content: m.content });
    }
  }

  return messages;
}
