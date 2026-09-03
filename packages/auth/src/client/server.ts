import { cookies } from "next/headers";
import { createLocalDemoUser, hasLocalDemoCookie, LOCAL_DEMO_AUTH_COOKIE } from "../local-demo";

export const AUTH_ACCESS_COOKIE = "xsolt_access_token";
export const AUTH_REFRESH_COOKIE = "xsolt_refresh_token";

export type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: unknown;
  };
};

function backendBaseUrl() {
  return process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
}

function getBearer(headers: Headers) {
  const header = headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_ACCESS_COOKIE)?.value ?? null;
}

export async function setAuthCookies(tokens: { access_token: string; refresh_token: string; expires_at?: string }) {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  cookieStore.set(AUTH_ACCESS_COOKIE, tokens.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  cookieStore.set(AUTH_REFRESH_COOKIE, tokens.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_ACCESS_COOKIE);
  cookieStore.delete(AUTH_REFRESH_COOKIE);
  cookieStore.delete(LOCAL_DEMO_AUTH_COOKIE);
}

export async function getUser(): Promise<AuthUser | null> {
  const baseUrl = backendBaseUrl();
  const token = await getAccessToken();
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get(LOCAL_DEMO_AUTH_COOKIE)?.value;
  if (!token && hasLocalDemoCookie(demoCookie)) {
    return createLocalDemoUser();
  }
  if (!baseUrl || !token) return null;

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/me`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const payload = await response.json().catch(() => null);
  return payload?.data ?? null;
}

export async function getInitialAuthUser() {
  return getUser();
}

export async function getSession() {
  const token = await getAccessToken();
  if (token) return { access_token: token };
  const cookieStore = await cookies();
  return hasLocalDemoCookie(cookieStore.get(LOCAL_DEMO_AUTH_COOKIE)?.value)
    ? { access_token: "local-demo" }
    : null;
}

export function authUserFromHeaders(headers: Headers): AuthUser | null {
  const token = getBearer(headers);
  return token ? { id: "token-user" } : null;
}
