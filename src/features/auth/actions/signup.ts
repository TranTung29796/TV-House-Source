"use server";

import { analytics } from "@datbuilds/analytics";
import { sendSignupMagicLink, type MagicLinkResult } from "@datbuilds/auth/actions";
import type { MagicLinkSignupInput } from "@datbuilds/auth/schemas";

export async function signUpForProduct(
  input: MagicLinkSignupInput & { redirectTo?: string },
): Promise<MagicLinkResult> {
  const result = await sendSignupMagicLink(input);

  if (!result.success) return result;

  analytics.track({
    name: "signup_magic_link_requested",
    properties: { email_domain: input.email.split("@")[1] ?? "" },
  });

  return result;
}
