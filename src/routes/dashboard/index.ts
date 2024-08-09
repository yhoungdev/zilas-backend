import express from "express";
import {
  deleteUserController,
  getUserController,
  listAllUsersController,
  updateUserController,
  verifyUserController,
} from "../../controllers/dashboard/users";

const router = express.Router();

router.get("/admin/users", listAllUsersController);
router.get("/admin/users/:id", getUserController);
router.patch("/admin/users/verify", verifyUserController);
router.put("/admin/users/update", updateUserController);
router.delete("/admin/users/:id", deleteUserController);



export const adminRoutes = router;
