export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, string | number | boolean | null>;
};

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  page(name: string): void;
}

/**
 * No-op provider used during local development or when analytics is disabled.
 */
export const noopAnalytics: AnalyticsProvider = {
  track: () => {},
  identify: () => {},
  page: () => {},
};

let provider: AnalyticsProvider = noopAnalytics;

export function setAnalyticsProvider(next: AnalyticsProvider) {
  provider = next;
}

export const analytics = {
  track: (event: AnalyticsEvent) => provider.track(event),
  identify: (userId: string, traits?: Record<string, unknown>) =>
    provider.identify(userId, traits),
  page: (name: string) => provider.page(name),
};

export interface PostHogProviderOptions {
  apiKey?: string;
  host?: string;
  distinctId?: string;
}

function runtimeEnv() {
  return (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
}

function postHogCapture(
  options: PostHogProviderOptions,
  event: string,
  properties: Record<string, unknown> = {},
) {
  const env = runtimeEnv();
  const apiKey =
    options.apiKey ??
    env?.POSTHOG_API_KEY ??
    env?.NEXT_PUBLIC_POSTHOG_KEY ??
    env?.NEXT_PUBLIC_ANALYTICS_ID;

  if (!apiKey) return;

  const host =
    options.host ??
    env?.POSTHOG_HOST ??
    env?.NEXT_PUBLIC_POSTHOG_HOST ??
    "https://app.posthog.com";

  const distinctId =
    options.distinctId ??
    String(properties.user_id ?? properties.distinct_id ?? "anonymous");

  void fetch(`${host.replace(/\/$/, "")}/capture/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      event,
      distinct_id: distinctId,
      properties,
    }),
    keepalive: true,
  }).catch((error: unknown) => {
    if (env?.NODE_ENV !== "production") {
      console.warn("[Analytics]", error);
    }
  });
}

export function createPostHogProvider(
  options: PostHogProviderOptions = {},
): AnalyticsProvider {
  return {
    track(event) {
      postHogCapture(options, event.name, event.properties ?? {});
    },
    identify(userId, traits = {}) {
      postHogCapture(options, "$identify", {
        distinct_id: userId,
        $set: traits,
      });
    },
    page(name) {
      postHogCapture(options, "$pageview", { path: name });
    },
  };
}

setAnalyticsProvider(createPostHogProvider());
