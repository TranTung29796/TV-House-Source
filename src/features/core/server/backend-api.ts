import { getUser } from "@datbuilds/auth/client/server";

type BackendSuccess<T> = {
  ok: true;
  status: number;
  data: T;
};

type BackendFailure = {
  ok: false;
  status: number;
  code: string;
  message: string;
  details?: unknown;
};

export type BackendResult<T> = BackendSuccess<T> | BackendFailure;

function backendBaseUrl() {
  return process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
}

export function isBackendConfigured() {
  return Boolean(backendBaseUrl());
}

export async function backendRequest<T>(
  path: string,
  init: RequestInit & {
    requireUser?: boolean;
  } = {},
): Promise<BackendResult<T>> {
  const baseUrl = backendBaseUrl();
  if (!baseUrl) {
    return {
      ok: false,
      status: 500,
      code: "BACKEND_NOT_CONFIGURED",
      message: "Backend API is not configured.",
    };
  }

  const headers = new Headers(init.headers);
  if (!headers.has("content-type") && init.body) {
    headers.set("content-type", "application/json");
  }

  const user = await getUser();
  if (init.requireUser && !user?.id) {
    return {
      ok: false,
      status: 401,
      code: "UNAUTHENTICATED",
      message: "Authentication required.",
    };
  }

  const internalToken = process.env.BACKEND_INTERNAL_TOKEN;
  if (internalToken && user?.id) {
    headers.set("authorization", `Bearer ${internalToken}`);
    headers.set("x-user-id", user.id);
    if (user.email) headers.set("x-user-email", user.email);
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    return {
      ok: false,
      status: response.status,
      code: payload?.error?.code ?? `HTTP_${response.status}`,
      message: payload?.error?.message ?? payload?.message ?? response.statusText,
      details: payload,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: (payload?.data ?? payload) as T,
  };
}
