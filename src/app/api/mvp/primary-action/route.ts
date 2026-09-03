import { NextResponse } from "next/server";

import { completePrimaryAction } from "@/features/core/server/primary-action.service";

export async function POST(request: Request) {
  const result = await completePrimaryAction(await request.json());

  if (!result.success) {
    return NextResponse.json({ error: result.error, issues: result.issues }, { status: result.status });
  }

  return NextResponse.json({ ok: true, record: result.record });
}
