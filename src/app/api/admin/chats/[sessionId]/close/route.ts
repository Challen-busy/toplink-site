import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function POST(_req: Request, ctx: RouteContext) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await ctx.params;

  const session = await db.chatSession.findUnique({
    where: { id: sessionId },
  });
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await db.chatSession.update({
    where: { id: sessionId },
    data: { status: "CLOSED" },
  });

  await db.chatMessage.create({
    data: {
      sessionId,
      role: "system",
      content: "This conversation has been closed by an agent.",
    },
  });

  return NextResponse.json({ ok: true });
}
