import { defaultUsersRoute } from "../routes";
import authRouter from "../routes/auth.route";
import { adminRoutes } from "../routes/dashboard";

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
