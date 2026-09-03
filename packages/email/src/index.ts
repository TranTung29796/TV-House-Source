export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

function runtimeEnv() {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
}

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const env = runtimeEnv();
  const apiKey = env?.RESEND_API_KEY;

  if (!apiKey) {
    return { success: false, error: "Email provider is not configured." };
  }

  const from = message.from ?? env?.EMAIL_FROM ?? "XSolution <hello@example.com>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | { id?: string; message?: string }
    | null;

  if (!response.ok) {
    return {
      success: false,
      error: payload?.message ?? "Could not send email.",
    };
  }

  return { success: true, id: payload?.id };
}

export function welcomeEmail(params: { email: string; name?: string | null }) {
  const name = params.name?.trim() || "there";
  const appUrl = runtimeEnv()?.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return sendEmail({
    to: params.email,
    subject: "Welcome to your MVP workspace",
    html: `
      <h1>Welcome, ${name}</h1>
      <p>Your account is ready. Open your account to manage access and continue into the product.</p>
      <p><a href="${appUrl}/account">Open account</a></p>
    `,
    text: `Welcome, ${name}. Your account is ready.`,
  });
}

export function subscriptionActiveEmail(params: { email: string; name?: string | null }) {
  const name = params.name?.trim() || "there";
  const appUrl = runtimeEnv()?.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return sendEmail({
    to: params.email,
    subject: "Your subscription is active",
    html: `
      <h1>Subscription active</h1>
      <p>Hi ${name}, your Pro subscription is active.</p>
      <p><a href="${appUrl}/account#billing">Manage billing</a></p>
    `,
    text: `Hi ${name}, your Pro subscription is active.`,
  });
}
