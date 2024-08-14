import express from "express";
import {
  deleteUserController,
  getUserController,
  listAllUsersController,
  updateUserController,
  updateUserRankController,
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
import { upload } from "../../../middleware/multer";

const router = express.Router();

router.post("/admin/login", loginAdminController);
router.post("/admin/create", createAdminController);
router.get("/admin/users", listAllUsersController);
router.get("/admin/users/:id", getUserController);
router.patch("/admin/users/verify", verifyUserController);
router.patch("/admin/users/update/:id", updateUserController);
router.patch("/admin/users/update-rank/:id", updateUserRankController);
router.delete("/admin/users/:id", deleteUserController);

//products endpoint
//#region product
router.get("/admin/products", adminFetchProductsController);
router.post(
  "/admin/product/add",
  upload.single("image"),
  adminAddProductController,
);
router.patch("/admin/product/update/:id", adminUpdateProductController);
router.delete("/admin/product/delete/:id", adminDeleteProductController);

export const adminRoutes = router;
