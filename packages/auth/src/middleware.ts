import { type NextRequest, NextResponse } from "next/server";
import { AUTH_ACCESS_COOKIE } from "./client/server";
import { hasLocalDemoCookie, LOCAL_DEMO_AUTH_COOKIE } from "./local-demo";

const DEFAULT_PROTECTED = ["/account", "/admin"];
const AUTH_ROUTES = ["/login", "/signup"];

export interface AuthMiddlewareConfig {
  protectedPaths?: string[];
  loginPath?: string;
  afterLoginPath?: string;
}

export function createAuthMiddleware(options: AuthMiddlewareConfig = {}) {
  const {
    protectedPaths = DEFAULT_PROTECTED,
    loginPath = "/login",
    afterLoginPath = "/account",
  } = options;

  return function authMiddleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const hasSession = Boolean(request.cookies.get(AUTH_ACCESS_COOKIE)?.value)
      || hasLocalDemoCookie(request.cookies.get(LOCAL_DEMO_AUTH_COOKIE)?.value);
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
    if (isProtected && !hasSession) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = loginPath;
      redirectUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(redirectUrl);
    }

    const isAuthRoute = AUTH_ROUTES.some((path) => pathname.startsWith(path));
    if (isAuthRoute && hasSession) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = afterLoginPath;
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  };
}
