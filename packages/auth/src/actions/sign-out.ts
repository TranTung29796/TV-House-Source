"use server";

import { clearAuthCookies, AUTH_REFRESH_COOKIE } from "../client/server";
import { cookies } from "next/headers";

function backendBaseUrl() {
  return process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
}

export async function signOut(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(AUTH_REFRESH_COOKIE)?.value;
  const baseUrl = backendBaseUrl();
  if (baseUrl && refreshToken) {
    await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/logout`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    }).catch(() => undefined);
  }
  await clearAuthCookies();
  return { success: true };
}
