import {
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";

let isConfigured = false;

/**
 * Configure the Lemon Squeezy SDK. Must be called once before any API call.
 * Safe to call multiple times — it's a no-op after the first call.
 */
export function configureLemonSqueezy() {
  if (isConfigured) return;

  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error("Missing LEMON_SQUEEZY_API_KEY environment variable.");
  }

  lemonSqueezySetup({ apiKey, onError: (error) => console.error("[LemonSqueezy]", error) });
  isConfigured = true;
}
