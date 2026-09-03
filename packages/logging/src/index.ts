export interface ErrorPayload {
  message: string;
  stack?: string;
  digest?: string;
  context?: Record<string, string | number | boolean | null | undefined>;
  level?: "error" | "warning" | "info";
}

function runtimeEnv() {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
}

export function serializeError(
  error: unknown,
  context?: ErrorPayload["context"],
): ErrorPayload {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      digest: "digest" in error ? String(error.digest) : undefined,
      context,
      level: "error",
    };
  }

  return {
    message: typeof error === "string" ? error : "Unknown error",
    context,
    level: "error",
  };
}

export async function captureError(payload: ErrorPayload) {
  const env = runtimeEnv();
  const endpoint = env?.ERROR_LOG_ENDPOINT;

  console.error("[Error]", JSON.stringify(payload));

  if (!endpoint) return;

  await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env?.ERROR_LOG_TOKEN
        ? { Authorization: `Bearer ${env.ERROR_LOG_TOKEN}` }
        : {}),
    },
    body: JSON.stringify(payload),
  }).catch((error: unknown) => {
    console.error("[Error logging failed]", error);
  });
}

export async function reportClientError(payload: ErrorPayload) {
  await fetch("/api/errors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}
