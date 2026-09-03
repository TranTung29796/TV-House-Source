import { redirect } from "next/navigation";
import { setAuthCookies } from "@datbuilds/auth/client/server";

function backendBaseUrl() {
  return process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
}

export async function handleAuthCallback(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const next = url.searchParams.get("next") || "/account";
  const safeNext = next.startsWith("/") ? next : "/account";
  const baseUrl = backendBaseUrl();

  if (!token || !baseUrl) {
    redirect(`/login?error=auth_callback_failed`);
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/magic-link/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false || !payload?.data?.access_token || !payload?.data?.refresh_token) {
    redirect(`/login?error=auth_callback_failed`);
  }

  await setAuthCookies(payload.data);
  redirect(safeNext);
}
