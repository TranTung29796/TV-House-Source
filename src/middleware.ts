import { createAuthMiddleware } from "@datbuilds/auth/middleware";
import { appRoutes } from "@/config/routes";

/**
 * Auth middleware — protects routes and refreshes sessions.
 * Customize protectedPaths per product as needed.
 */
export const middleware = createAuthMiddleware({
  protectedPaths: [appRoutes.product.account],
  loginPath: appRoutes.auth.login,
  afterLoginPath: appRoutes.product.account,
});

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images.
     * This ensures auth middleware runs on all dynamic routes.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
