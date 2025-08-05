export const ROUTES = {
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  INVITE: "/invite",
  LINK_SENT: "/link-sent",
  REPORT: "/report/:id",
  PROFILE: "/profile",
  HOME: "/",
  BOARD: "/board",
  PLANS: "/plans",
  PLAN: "/plans/:id",
  MY_RATES: "/my-rates",
  SUPPORT: "/support",
};

export const protectedRoutes = [
  ROUTES.HOME,
  ROUTES.BOARD,
  ROUTES.PLANS,
  ROUTES.PLAN,
  ROUTES.MY_RATES,
  ROUTES.SUPPORT,
  ROUTES.PROFILE,
];
