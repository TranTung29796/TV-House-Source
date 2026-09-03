import { verifyWebhookSignature } from "./verify";

/**
 * Webhook event types we handle from Lemon Squeezy.
 */
export type WebhookEventName =
  | "subscription_created"
  | "subscription_updated"
  | "subscription_cancelled"
  | "subscription_resumed"
  | "subscription_expired"
  | "subscription_paused"
  | "subscription_unpaused"
  | "subscription_payment_success"
  | "subscription_payment_failed"
  | "order_created";

export interface WebhookEvent {
  /** Unique event delivery ID from Lemon Squeezy (for idempotency) */
  eventId: string;
  eventName: WebhookEventName;
  /** The Lemon Squeezy resource data (subscription/order) */
  data: Record<string, unknown>;
  /** Custom data passed during checkout (tenant scope + selected level) */
  customData: {
    user_id?: string;
    workspace_id?: string;
    product_id?: string;
    level_id?: string;
  } | null;
}

export interface WebhookResult {
  success: boolean;
  event?: WebhookEvent;
  error?: string;
}

/** UUID v4 regex for validating user_id format */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validate that a user_id is a proper UUID to prevent injection.
 */
export function isValidUserId(id: string | undefined): id is string {
  if (!id) return false;
  return UUID_REGEX.test(id);
}

/**
 * Process a Lemon Squeezy webhook request.
 *
 * Security checklist:
 * 1. ✅ Reads raw body for signature verification
 * 2. ✅ Verifies HMAC-SHA256 signature (rejects if invalid)
 * 3. ✅ Validates event structure
 * 4. ✅ Extracts event ID for idempotency checks
 * 5. ✅ Validates user_id format (UUID)
 *
 * Usage in product's route handler:
 * ```ts
 * import { handleWebhook } from "@datbuilds/payments/webhook";
 *
 * export async function POST(req: Request) {
 *   const result = await handleWebhook(req);
 *   if (!result.success) return new Response(result.error, { status: 400 });
 *
 *   // Check idempotency (skip if already processed)
 *   const alreadyProcessed = await checkEventProcessed(result.event.eventId);
 *   if (alreadyProcessed) return new Response("OK", { status: 200 });
 *
 *   // Handle the event
 *   switch (result.event.eventName) { ... }
 *
 *   // Mark as processed
 *   await markEventProcessed(result.event.eventId);
 *   return new Response("OK", { status: 200 });
 * }
 * ```
 */
export async function handleWebhook(request: Request): Promise<WebhookResult> {
  // Read raw body for signature verification
  const rawBody = await request.text();

  // Reject empty bodies early
  if (!rawBody || rawBody.length === 0) {
    return { success: false, error: "Empty request body." };
  }

  // Reject unreasonably large payloads (max 1MB)
  if (rawBody.length > 1_048_576) {
    return { success: false, error: "Payload too large." };
  }

  // Get signature from headers
  const signature = request.headers.get("x-signature") ?? "";

  // Verify signature — reject immediately if invalid
  const isValid = verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    console.warn("[Payments Webhook] Invalid signature — rejecting request.");
    return { success: false, error: "Invalid webhook signature." };
  }

  // Parse the payload
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return { success: false, error: "Invalid JSON body." };
  }

  // Extract event metadata
  const meta = payload.meta as
    | {
        event_name?: string;
        webhook_id?: string;
        custom_data?: Record<string, unknown>;
      }
    | undefined;

  if (!meta?.event_name) {
    return { success: false, error: "Missing event_name in meta." };
  }

  const eventName = meta.event_name as WebhookEventName;
  const customData =
    (meta.custom_data as {
      user_id?: string;
      workspace_id?: string;
      product_id?: string;
      level_id?: string;
    }) ?? null;
  const data = (payload.data as Record<string, unknown>) ?? {};

  // Generate a unique event ID for idempotency.
  // Lemon Squeezy doesn't provide a unique delivery ID in the payload,
  // so we use webhook_id + event_name + resource id as a composite key.
  const resourceId = String((data as { id?: unknown }).id ?? "unknown");
  const eventId = `${meta.webhook_id ?? "wh"}_${eventName}_${resourceId}`;

  // Validate user_id format if present
  if (customData?.user_id && !isValidUserId(customData.user_id)) {
    console.warn(
      "[Payments Webhook] Invalid user_id format:",
      customData.user_id,
    );
    return { success: false, error: "Invalid user_id format." };
  }

  if (
    (customData?.workspace_id && !isValidUserId(customData.workspace_id)) ||
    (customData?.product_id && !isValidUserId(customData.product_id))
  ) {
    console.warn("[Payments Webhook] Invalid tenant scope format.");
    return { success: false, error: "Invalid tenant scope format." };
  }

  return {
    success: true,
    event: { eventId, eventName, data, customData },
  };
}
