import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES, ROLE_ROUTES, ROUTES } from "@/constants/routes";
import { Role } from "@/types/enums";

/** Role → protected route prefix (routes that only that role can access) */
const ROLE_PROTECTED_PREFIXES: Partial<Record<Role, string>> = {
  [Role.Sales]: "/sales",
  [Role.Sanction]: "/sanction",
  [Role.Disbursement]: "/disbursement",
  [Role.Collection]: "/collection",
  [Role.Admin]: "/analytics",
};

function getAuthFromRequest(request: NextRequest): {
  isAuthenticated: boolean;
  role: Role | null;
} {
  // Read persisted Zustand auth store from cookie (set by the app via document.cookie)
  const authCookie = request.cookies.get("quickcred-auth-role")?.value;
  const tokenCookie = request.cookies.get("quickcred-auth-token")?.value;

  if (!tokenCookie || !authCookie) {
    return { isAuthenticated: false, role: null };
  }

  return {
    isAuthenticated: true,
    role: authCookie as Role,
  };
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const { isAuthenticated, role } = getAuthFromRequest(request);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname as (typeof PUBLIC_ROUTES)[number]) || pathname === "/";

  // Unauthenticated user trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access auth pages → redirect to their dashboard
  if (isAuthenticated && (pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER)) {
    const redirect = role ? (ROLE_ROUTES[role] ?? ROUTES.DASHBOARD) : ROUTES.DASHBOARD;
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  // Role-based route protection for authenticated users
  if (isAuthenticated && role) {
    for (const [allowedRole, prefix] of Object.entries(ROLE_PROTECTED_PREFIXES)) {
      if (pathname.startsWith(prefix)) {
        // Admin can access everything
        if (role === Role.Admin) break;
        // Exact role match required
        if (role !== allowedRole) {
          const fallback = ROLE_ROUTES[role] ?? ROUTES.DASHBOARD;
          return NextResponse.redirect(new URL(fallback, request.url));
        }
        break;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
