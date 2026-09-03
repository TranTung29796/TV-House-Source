export const LOCAL_DEMO_AUTH_COOKIE = "xsolt_demo_auth";
export const LOCAL_DEMO_AUTH_EMAIL = "demo@example.com";
export const LOCAL_DEMO_AUTH_USER_ID = "11111111-1111-4111-8111-111111111111";
export const LOCAL_DEMO_AUTH_NAME = "Local Demo User";

export function isLocalDemoAuthEnabled() {
  return process.env.NEXT_PUBLIC_LOCAL_DEMO_AUTH_ENABLED === "true";
}

export function hasLocalDemoCookie(value?: string) {
  return isLocalDemoAuthEnabled() && value === "1";
}

export function createLocalDemoUser() {
  if (!isLocalDemoAuthEnabled()) return null;
  return {
    id: LOCAL_DEMO_AUTH_USER_ID,
    email: LOCAL_DEMO_AUTH_EMAIL,
    user_metadata: {
      full_name: LOCAL_DEMO_AUTH_NAME,
    },
  };
}
