"use server";

import { cookies } from "next/headers";
import {
  magicLinkLoginSchema,
  magicLinkSignupSchema,
  type MagicLinkLoginInput,
  type MagicLinkSignupInput,
} from "../schemas";
import {
  hasLocalDemoCookie,
  isLocalDemoAuthEnabled,
  LOCAL_DEMO_AUTH_COOKIE,
  LOCAL_DEMO_AUTH_EMAIL,
} from "../local-demo";

export interface MagicLinkResult {
  success: boolean;
  error?: string;
  completed?: boolean;
  token?: string;
}

function backendBaseUrl() {
  return process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
}

async function requestMagicLink(body: Record<string, unknown>): Promise<MagicLinkResult> {
  const baseUrl = backendBaseUrl();
  if (!baseUrl) return { success: false, error: "Backend API is not configured." };

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/magic-link`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    return {
      success: false,
      error: payload?.error?.message ?? payload?.error ?? "Could not send magic link. Please try again.",
    };
  }
  return { success: true, token: payload?.data?.token };
}

export async function sendLoginMagicLink(
  input: MagicLinkLoginInput & { redirectTo?: string },
): Promise<MagicLinkResult> {
  const parsed = magicLinkLoginSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
  if (isLocalDemoAuthEnabled() && parsed.data.email.toLowerCase() === LOCAL_DEMO_AUTH_EMAIL) {
    const cookieStore = await cookies();
    if (!hasLocalDemoCookie(cookieStore.get(LOCAL_DEMO_AUTH_COOKIE)?.value)) {
      cookieStore.set(LOCAL_DEMO_AUTH_COOKIE, "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return { success: true, completed: true };
  }
  return requestMagicLink({
    email: parsed.data.email,
    purpose: "login",
    redirect_to: input.redirectTo,
  });
}

export async function sendSignupMagicLink(
  input: MagicLinkSignupInput & { redirectTo?: string },
): Promise<MagicLinkResult> {
  const parsed = magicLinkSignupSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
  if (isLocalDemoAuthEnabled() && parsed.data.email.toLowerCase() === LOCAL_DEMO_AUTH_EMAIL) {
    const cookieStore = await cookies();
    cookieStore.set(LOCAL_DEMO_AUTH_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return { success: true, completed: true };
  }
  return requestMagicLink({
    email: parsed.data.email,
    name: parsed.data.fullName,
    purpose: "signup",
    redirect_to: input.redirectTo,
  });
}
