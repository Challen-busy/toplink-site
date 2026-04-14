import { Resend } from "resend";

type HandoffPayload = {
  sessionId: string;
  reason: string;
  visitorMessage: string;
  language: string | null;
  pageUrl: string | null;
};

export async function sendHandoffNotification(payload: HandoffPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(
      "[chat-email] RESEND_API_KEY not set; skipping handoff notification for session",
      payload.sessionId,
    );
    return { skipped: true };
  }

  const from =
    process.env.INQUIRY_NOTIFY_FROM ??
    "TopLink Site <no-reply@toplinkelec.com>";
  const to = (
    process.env.INQUIRY_NOTIFY_TO ?? "ken@toplinkelec.com,sales@toplinkelec.com"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://toplink.observer"}/admin/chats/${payload.sessionId}`;

  const subject = `Live chat needs human — ${payload.reason}`;

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:auto;color:#1f1f23">
      <h2 style="margin:0 0 8px;font-weight:600">${escapeHtml(subject)}</h2>
      <p style="color:#5b5d6b;margin:0 0 16px;font-size:14px">A visitor requested human assistance in the live chat.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px">
        <tr><td style="padding:6px 0;color:#5b5d6b;width:30%">Reason</td><td style="padding:6px 0">${escapeHtml(payload.reason)}</td></tr>
        <tr><td style="padding:6px 0;color:#5b5d6b">Language</td><td style="padding:6px 0">${escapeHtml(payload.language ?? "unknown")}</td></tr>
        <tr><td style="padding:6px 0;color:#5b5d6b">Page</td><td style="padding:6px 0">${escapeHtml(payload.pageUrl ?? "—")}</td></tr>
      </table>
      <h3 style="margin:0 0 8px;font-size:14px;text-transform:uppercase;color:#5b5d6b">Last visitor message</h3>
      <div style="white-space:pre-wrap;padding:12px;background:#f3f4f8;border-radius:12px;font-size:14px">${escapeHtml(payload.visitorMessage)}</div>
      <p style="margin:24px 0 0;font-size:13px"><a href="${adminUrl}" style="color:#6750f4">Open conversation in admin →</a></p>
    </div>`;

  const resend = new Resend(apiKey);
  try {
    const res = await resend.emails.send({ from, to, subject, html });
    return { sent: true, id: res.data?.id };
  } catch (err) {
    console.error("[chat-email] send failed", err);
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
