import { NextResponse } from "next/server";

import { createLevelCheckout } from "@/features/billing/server/checkout.service";

export async function POST(request: Request) {
  const result = await createLevelCheckout(await request.json());

  if (!result.success) {
    return NextResponse.json({ error: result.error, issues: result.issues }, { status: result.status });
  }

  return NextResponse.json({ url: result.url });
}
