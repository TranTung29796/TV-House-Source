import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const backendBaseUrl = process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!backendBaseUrl) {
    return NextResponse.json({ ok: false, code: "BACKEND_NOT_CONFIGURED", message: "Backend API is not configured." }, { status: 500 });
  }

  const body = await request.text();
  const response = await fetch(`${backendBaseUrl.replace(/\/$/, "")}/api/v1/payments/webhook`, {
    method: "POST",
    headers: {
      "content-type": request.headers.get("content-type") ?? "application/json",
      "stripe-signature": request.headers.get("stripe-signature") ?? "",
      "x-signature": request.headers.get("x-signature") ?? "",
      "x-webhook-provider": "lemon_squeezy",
    },
    body,
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({ received: response.ok }));
  return NextResponse.json(payload, { status: response.status });
}
