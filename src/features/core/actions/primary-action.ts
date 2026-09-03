"use server";

import { analytics } from "@datbuilds/analytics";
import { completePrimaryAction } from "../server/primary-action.service";

export async function submitPrimaryAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  analytics.track({ name: "primary_action_started", properties: { product_id: "web-template-copy-smoke" } });

  if (!title) {
    analytics.track({ name: "primary_action_failed", properties: { product_id: "web-template-copy-smoke", reason: "missing_title" } });
    throw new Error("Title is required");
  }

  analytics.track({
    name: "primary_action_completed",
    properties: { product_id: "web-template-copy-smoke", title, has_description: Boolean(description) },
  });

  const result = await completePrimaryAction({ title, description });
  if (!result.success) {
    throw new Error(result.error);
  }

  return result.record;
}
