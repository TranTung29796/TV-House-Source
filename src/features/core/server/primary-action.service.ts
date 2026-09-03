import { z } from "zod";

import { analytics } from "@datbuilds/analytics";
import { getUser } from "@datbuilds/auth/client/server";

const primaryActionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
});

export type PrimaryActionResult =
  | { success: true; record: unknown }
  | { success: false; status: number; error: string; issues?: unknown };

export async function completePrimaryAction(input: unknown): Promise<PrimaryActionResult> {
  const parsed = primaryActionSchema.safeParse(input);
  if (!parsed.success) {
    analytics.track({ name: "primary_action_failed", properties: { product_id: "web-template-copy-smoke", reason: "validation" } });
    return { success: false, status: 400, error: "invalid_request", issues: parsed.error.flatten() };
  }

  const backendBaseUrl = process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  const backendToken = process.env.BACKEND_INTERNAL_TOKEN;
  const user = await getUser();
  if (!user?.id) {
    analytics.track({ name: "primary_action_failed", properties: { product_id: "web-template-copy-smoke", reason: "unauthorized" } });
    return { success: false, status: 401, error: "unauthorized" };
  }

  if (!backendBaseUrl || !backendToken) {
    analytics.track({ name: "primary_action_failed", properties: { product_id: "web-template-copy-smoke", reason: "missing_backend_url" } });
    return { success: false, status: 500, error: "BACKEND_API_BASE_URL and BACKEND_INTERNAL_TOKEN are required" };
  }

  const response = await fetch(`${backendBaseUrl.replace(/\/$/, "")}/api/v1/records`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${backendToken}`,
      "x-user-id": user.id,
      ...(user.email ? { "x-user-email": user.email } : {}),
    },
    body: JSON.stringify({
      name: parsed.data.title,
      description: parsed.data.description,
      status: "active",
      data: { source: "web-template-primary-action" },
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    analytics.track({ name: "primary_action_failed", properties: { product_id: "web-template-copy-smoke", reason: "backend_error", status: response.status } });
    return { success: false, status: response.status, error: typeof payload?.error === "string" ? payload.error : "backend_error", issues: payload };
  }

  analytics.track({ name: "primary_action_completed", properties: { product_id: "web-template-copy-smoke", title: parsed.data.title } });
  return { success: true, record: payload?.data ?? payload };
}
