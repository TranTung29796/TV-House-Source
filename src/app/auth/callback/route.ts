import { handleAuthCallback } from "@/features/auth/server/callback.service";

/**
 * Auth callback handler.
 * Supabase redirects here after OAuth consent or email confirmation.
 * Exchanges the code for a session, then redirects to the intended page.
 */
export async function GET(request: Request) {
  return handleAuthCallback(request);
}
