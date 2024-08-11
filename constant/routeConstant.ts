import { defaultUsersRoute } from "../src/routes";
import authRouter from "../src/routes/auth.route";

import { adminRoutes } from "../src/routes/dashboard";

export const ROUTES_CONSTANT = [
  {
    title: "Auth",
    route: authRouter,
  },
  {
    title: "admin",
    route: adminRoutes,
  },
  {
    title: "user",
    route: defaultUsersRoute,
  },
];
