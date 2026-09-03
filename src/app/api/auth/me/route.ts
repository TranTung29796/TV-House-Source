import { NextResponse } from "next/server";
import { getUser } from "@datbuilds/auth/client/server";

export async function GET() {
  return NextResponse.json({ user: await getUser() });
}
