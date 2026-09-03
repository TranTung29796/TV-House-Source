import { z } from "zod";

/**
 * Server-side environment schema. These are never exposed to the client.
 * All secrets MUST remain server-only.
 */
const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PRODUCT_CODE: z.string().min(1).optional(),
  COMPANY_NAME: z.string().min(1).optional(),
  SUPPORT_EMAIL: z.string().email().optional(),
  LEGAL_ENTITY: z.string().min(1).optional(),
  GOVERNING_LAW: z.string().min(1).optional(),
  REFUND_POLICY: z.string().min(1).optional(),
  DATA_RETENTION_POLICY: z.string().min(1).optional(),

  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),

  // --- Supabase (server) ---
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // --- Lemon Squeezy ---
  LEMON_SQUEEZY_API_KEY: z.string().min(1).optional(),
  LEMON_SQUEEZY_WEBHOOK_SECRET: z.string().min(1).optional(),
  LEMON_SQUEEZY_STORE_ID: z.string().optional(),
  LEMON_SQUEEZY_VARIANT_ID: z.string().optional(),
  LEMON_SQUEEZY_VARIANT_FREE: z.string().optional(),
  LEMON_SQUEEZY_VARIANT_PRO: z.string().optional(),
  LEMON_SQUEEZY_VARIANT_PRO_YEARLY: z.string().optional(),
  LEMON_SQUEEZY_VARIANT_LIFETIME: z.string().optional(),
  LEMON_SQUEEZY_VARIANT_TEAM: z.string().optional(),

  // --- Analytics / logging / email ---
  POSTHOG_API_KEY: z.string().min(1).optional(),
  POSTHOG_HOST: z.string().url().optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().optional(),
  ERROR_LOG_ENDPOINT: z.string().url().optional(),
  ERROR_LOG_TOKEN: z.string().min(1).optional(),
  ADMIN_EMAILS: z.string().optional(),

  // --- Legacy / misc ---
  AUTH_SECRET: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
});

/**
 * Client-side environment schema. Only `NEXT_PUBLIC_*` keys belong here.
 * These are safe to embed in the browser bundle.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_PRODUCT_NAME: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().optional(),

  // --- Supabase (public) ---
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),

  // --- Crisp ---
  NEXT_PUBLIC_CRISP_WEBSITE_ID: z.string().optional(),

  // --- Analytics ---
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

function formatErrors(errors: Record<string, string[] | undefined>): string {
  return Object.entries(errors)
    .filter(([, v]) => v && v.length > 0)
    .map(([key, value]) => `  - ${key}: ${value!.join(", ")}`)
    .join("\n");
}

/**
 * Validate and parse environment variables at startup.
 * Throws a readable error if required vars are missing or malformed.
 */
export function createEnv(runtimeEnv: NodeJS.ProcessEnv = process.env) {
  const server = serverSchema.safeParse(runtimeEnv);
  const client = clientSchema.safeParse(runtimeEnv);

  if (!server.success || !client.success) {
    const issues = [
      !server.success
        ? formatErrors(server.error.formErrors.fieldErrors)
        : "",
      !client.success
        ? formatErrors(client.error.formErrors.fieldErrors)
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    throw new Error(`❌ Invalid environment variables:\n${issues}`);
  }

  return { ...server.data, ...client.data };
}

export type Env = ServerEnv & ClientEnv;
