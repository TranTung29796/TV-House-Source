import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { getCustomerPortalForCurrentUser } from "@/features/billing/server/billing.service";

/**
 * API route: Redirect user to their payment-provider customer portal.
 *
 * Security:
 * - Authenticated users only
 * - Subscription verified belongs to the requesting user
 */
export async function GET() {
  const requestHeaders = await headers();
  const isClientRequest = requestHeaders.get("x-xsolt-client") === "1";
  const result = await getCustomerPortalForCurrentUser();

  if (isClientRequest) {
    if (result.success) {
      return NextResponse.json({ success: true, url: result.url });
    }

    return NextResponse.json(
      { success: false, error: result.error, code: result.code ?? "BILLING_PORTAL_UNAVAILABLE" },
      { status: result.status },
    );
  }

  if (result.success) {
    redirect(result.url);
  }

  if (result.redirectTo) {
    redirect(result.redirectTo);
  }

  return NextResponse.json(
    { error: result.error },
    { status: result.status },
  );
}
