"use client";

declare global {
  interface Window {
    $crisp?: unknown[];
  }
}

/**
 * Identify the current user in Crisp chat.
 * Call this after successful authentication so support agents can see
 * who they're talking to.
 *
 * Security: Only sends email and name — no passwords, tokens, or sensitive data.
 *
 * Usage:
 * ```ts
 * import { identifyUser } from "@datbuilds/support/identify";
 * identifyUser({ email: user.email, name: user.name });
 * ```
 */
export function identifyUser(params: {
  email: string;
  name?: string;
  avatar?: string;
}) {
  if (typeof window === "undefined" || !window.$crisp) return;

  const { email, name, avatar } = params;

  window.$crisp.push(["set", "user:email", [email]]);

  if (name) {
    window.$crisp.push(["set", "user:nickname", [name]]);
  }

  if (avatar) {
    window.$crisp.push(["set", "user:avatar", [avatar]]);
  }
}

/**
 * Reset Crisp session (call on sign-out to clear user identity).
 */
export function resetCrispSession() {
  if (typeof window === "undefined" || !window.$crisp) return;
  window.$crisp.push(["do", "session:reset"]);
}
