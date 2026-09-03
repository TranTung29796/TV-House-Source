import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verify the Lemon Squeezy webhook signature using HMAC-SHA256.
 *
 * Security: Uses timingSafeEqual to prevent timing attacks.
 * Always verify before processing any webhook payload.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[Payments] Missing LEMON_SQUEEZY_WEBHOOK_SECRET");
    return false;
  }

  if (!signature) {
    return false;
  }

  const hmac = createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(digest, "utf-8"),
      Buffer.from(signature, "utf-8"),
    );
  } catch {
    return false;
  }
}
