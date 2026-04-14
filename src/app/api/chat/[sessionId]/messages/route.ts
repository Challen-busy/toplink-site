import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function GET(req: Request, ctx: RouteContext) {
  const { sessionId } = await ctx.params;
  const url = new URL(req.url);
  const afterId = url.searchParams.get("after");

  const session = await db.chatSession.findUnique({
    where: { id: sessionId },
    select: { id: true, status: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  let afterDate: Date | undefined;
  if (afterId) {
    const refMsg = await db.chatMessage.findUnique({
      where: { id: afterId },
      select: { createdAt: true },
    });
    if (refMsg) afterDate = refMsg.createdAt;
  }

  const messages = await db.chatMessage.findMany({
    where: {
      sessionId,
      ...(afterDate ? { createdAt: { gt: afterDate } } : {}),
    },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, content: true, createdAt: true },
  });

  return NextResponse.json({
    status: session.status,
    messages,
  });
}
