import { Resend } from "resend";

type InquiryEmailPayload = {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  country?: string | null;
  quantity?: string | null;
  message: string;
  productName?: string | null;
  source: string;
};

export async function sendInquiryNotification(payload: InquiryEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(
      "[email] RESEND_API_KEY not set; skipping notification for inquiry",
      payload.id,
    );
    return { skipped: true };
  }

  const from =
    process.env.INQUIRY_NOTIFY_FROM ??
    "TopLink Site <no-reply@toplinkelec.com>";
  const to = (process.env.INQUIRY_NOTIFY_TO ?? "ken@toplinkelec.com,sales@toplinkelec.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/inquiries`;

  const subject = payload.productName
    ? `New inquiry — ${payload.productName}`
    : `New inquiry from ${payload.name}`;

  const rows = [
    ["Source", payload.source],
    ["Product", payload.productName ?? "—"],
    ["Name", payload.name],
    ["Email", payload.email],
    ["Company", payload.company || "—"],
    ["Phone", payload.phone || "—"],
    ["Country", payload.country || "—"],
    ["Target quantity", payload.quantity || "—"],
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:auto;color:#1f1f23">
      <h2 style="margin:0 0 8px;font-weight:600">${subject}</h2>
      <p style="color:#5b5d6b;margin:0 0 16px;font-size:14px">Submitted via the TopLink website.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:6px 0;color:#5b5d6b;width:30%">${label}</td><td style="padding:6px 0">${escapeHtml(String(value ?? ""))}</td></tr>`,
          )
          .join("")}
      </table>
      <h3 style="margin:0 0 8px;font-size:14px;text-transform:uppercase;color:#5b5d6b">Project details</h3>
      <div style="white-space:pre-wrap;padding:12px;background:#f3f4f8;border-radius:12px;font-size:14px">${escapeHtml(payload.message)}</div>
      <p style="margin:24px 0 0;font-size:13px"><a href="${adminUrl}" style="color:#6750f4">Open in admin dashboard →</a></p>
    </div>`;

  const resend = new Resend(apiKey);
  try {
    const res = await resend.emails.send({
      from,
      to,
      replyTo: payload.email,
      subject,
      html,
    });
    return { sent: true, id: res.data?.id };
  } catch (err) {
    console.error("[email] send failed", err);
    return { skipped: true, error: String(err) };
  }
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
