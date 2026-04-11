import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inquirySchema } from "@/lib/validators";
import { sendInquiryNotification } from "@/lib/email";
import crypto from "node:crypto";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Validate productId if provided
  let productName: string | null = null;
  if (data.productId) {
    const product = await db.product.findUnique({
      where: { id: data.productId },
      select: { id: true, nameEn: true },
    });
    if (!product) {
      return NextResponse.json(
        { error: "Unknown product reference" },
        { status: 400 },
      );
    }
    productName = product.nameEn;
  }

  const ipHeader =
    req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "";
  const ipHash = ipHeader
    ? crypto.createHash("sha256").update(ipHeader).digest("hex").slice(0, 24)
    : null;
  const userAgent = req.headers.get("user-agent") ?? null;

  const inquiry = await db.inquiry.create({
    data: {
      source: data.source,
      productId: data.productId ?? null,
      name: data.name,
      email: data.email,
      company: data.company || null,
      phone: data.phone || null,
      country: data.country || null,
      quantity: data.quantity || null,
      message: data.message,
      status: "NEW",
      ipHash,
      userAgent,
    },
  });

  // Fire and forget email; do not block the response on email failures.
  sendInquiryNotification({
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    company: inquiry.company,
    phone: inquiry.phone,
    country: inquiry.country,
    quantity: inquiry.quantity,
    message: inquiry.message,
    productName,
    source: inquiry.source,
  }).catch((err) => console.error("[inquiries] email error", err));

  return NextResponse.json({ ok: true, id: inquiry.id });
}
