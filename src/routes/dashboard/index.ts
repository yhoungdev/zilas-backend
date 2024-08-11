import express from "express";
import {
  deleteUserController,
  getUserController,
  listAllUsersController,
  updateUserController,
  verifyUserController,
} from "../../controllers/dashboard/users";

import {
  loginAdminController,
  createAdminController,
} from "../../controllers/admin/auth";

const router = express.Router();

router.post("/admin/login", loginAdminController);
router.post("/admin/create", createAdminController);
router.get("/admin/users", listAllUsersController);
router.get("/admin/users/:id", getUserController);
router.patch("/admin/users/verify", verifyUserController);
router.put("/admin/users/update", updateUserController);
router.delete("/admin/users/:id", deleteUserController);

export const adminRoutes = router;
