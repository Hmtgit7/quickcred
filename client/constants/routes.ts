export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",

  LOANS: {
    ROOT: "/loans",
    APPLY: "/loans/apply",
    DETAIL: (id: string) => `/loans/${id}`,
  },

  SALES: "/sales",
  SANCTION: "/sanction",
  DISBURSEMENT: "/disbursement",
  COLLECTION: "/collection",
  ANALYTICS: "/analytics",
} as const;

/** Routes that do NOT require authentication */
export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.HOME];

/** Role → allowed dashboard routes */
export const ROLE_ROUTES: Record<string, string> = {
  admin: ROUTES.ANALYTICS,
  sales: ROUTES.SALES,
  sanction: ROUTES.SANCTION,
  disbursement: ROUTES.DISBURSEMENT,
  collection: ROUTES.COLLECTION,
  borrower: ROUTES.DASHBOARD,
};
