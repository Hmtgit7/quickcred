import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES, ROLE_ROUTES, ROUTES } from "@/constants/routes";
import { Role } from "@/types/enums";

interface TokenPayload {
  role?: Role;
  exp?: number;
}

const ROLE_PROTECTED_PREFIXES: { path: string; roles: Role[] }[] = [
  { path: ROUTES.DASHBOARD, roles: [Role.Borrower, Role.Admin] },
  { path: ROUTES.ANALYTICS, roles: [Role.Admin] },
  { path: ROUTES.SALES, roles: [Role.Sales, Role.Admin] },
  { path: ROUTES.SANCTION, roles: [Role.Sanction, Role.Admin] },
  { path: ROUTES.DISBURSEMENT, roles: [Role.Disbursement, Role.Admin] },
  { path: ROUTES.COLLECTION, roles: [Role.Collection, Role.Admin] },
  { path: ROUTES.LOANS.APPLY, roles: [Role.Borrower] },
];

function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = globalThis.atob(normalized);
    return JSON.parse(decoded) as TokenPayload;
  } catch {
    return null;
  }
}

function getTokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);

  return (
    request.cookies.get("quickcred-auth-token")?.value ??
    request.cookies.get("access_token")?.value ??
    null
  );
}

function getAuthFromRequest(request: NextRequest): {
  isAuthenticated: boolean;
  role: Role | null;
} {
  const token = getTokenFromRequest(request);
  if (!token) return { isAuthenticated: false, role: null };

  const payload = decodeToken(token);
  const roleCookie = request.cookies.get("quickcred-auth-role")?.value as
    | Role
    | undefined;
  const role = payload?.role ?? roleCookie ?? null;
  const isExpired = payload?.exp ? Date.now() / 1000 > payload.exp - 10 : false;

  if (isExpired) return { isAuthenticated: false, role: null };

  return { isAuthenticated: true, role };
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname as (typeof PUBLIC_ROUTES)[number]) ||
    pathname === "/";
  const { isAuthenticated, role } = getAuthFromRequest(request);

  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && (pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER)) {
    const redirect = role ? (ROLE_ROUTES[role] ?? ROUTES.DASHBOARD) : ROUTES.DASHBOARD;
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  if (isAuthenticated && role) {
    const restriction = ROLE_PROTECTED_PREFIXES.find(({ path }) =>
      pathname.startsWith(path)
    );

    if (restriction && !restriction.roles.includes(role)) {
      const fallback = ROLE_ROUTES[role] ?? ROUTES.DASHBOARD;
      return NextResponse.redirect(new URL(fallback, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
