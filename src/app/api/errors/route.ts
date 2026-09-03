import { NextResponse } from "next/server";
import { backendRequest } from "@/features/core/server/backend-api";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload?.message) {
    return NextResponse.json({ ok: false, code: "BAD_REQUEST", message: "Invalid error payload." }, { status: 400 });
  }

  const result = await backendRequest("/api/v1/errors", {
    method: "POST",
    body: JSON.stringify({
      source: "web",
      severity: payload.level ?? "error",
      message: payload.message,
      stack: payload.stack,
      code: payload.digest,
      path: payload.context?.path,
      metadata: payload.context ?? {},
    }),
  });

  return NextResponse.json(result, { status: result.status });
}
