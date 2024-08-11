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
import {
  adminAddProductController,
  adminDeleteProductController,
  adminUpdateProductController,
  adminFetchProductsController,
} from "../../controllers/admin/products";

const router = express.Router();

router.post("/admin/login", loginAdminController);
router.post("/admin/create", createAdminController);
router.get("/admin/users", listAllUsersController);
router.get("/admin/users/:id", getUserController);
router.patch("/admin/users/verify", verifyUserController);
router.put("/admin/users/update", updateUserController);
router.delete("/admin/users/:id", deleteUserController);

//products endpoint
router.post("/admin/products", adminFetchProductsController);
router.post("/admin/product/add", adminAddProductController);
router.post("/admin/product/update/:id", adminUpdateProductController);
router.post("/admin/product/detele/:id", adminDeleteProductController);

export const adminRoutes = router;
