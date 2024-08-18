import express from "express";
import {
  adminFundUsersWallet,
  banUserController,
  deleteUserController,
  getUserController,
  listAllExternalWalletsController,
  listAllUsersController,
  updateUserController,
  updateUserRankController,
  verifyUserController,
} from "../../controllers/dashboard/users";

import {
  loginAdminController,
  createAdminController,
  adminChangeUserPasswordController,
} from "../../controllers/admin/auth";
import {
  adminAddProductController,
  adminDeleteProductController,
  adminUpdateProductController,
  adminFetchProductsController,
} from "../../controllers/admin/products";
import { upload } from "../../../middleware/multer";
import { loginWithJwtController } from "../../controllers/auth";

const router = express.Router();

router.post("/admin/login", loginAdminController);
router.post("/admin/create", createAdminController);
router.post("/admin/sign-in-user", loginWithJwtController);
router.patch("/admin/users/change-password", adminChangeUserPasswordController);
router.post("/admin/users/fund-wallet/:id", adminFundUsersWallet);
router.get("/admin/users", listAllUsersController);
router.get(
  "/admin/users/fetch-external-wallets",
  listAllExternalWalletsController,
);
router.get("/admin/users/:id", getUserController);
router.patch("/admin/users/verify", verifyUserController);
router.patch("/admin/users/update/:id", updateUserController);
router.patch("/admin/users/update-rank/:id", updateUserRankController);
router.patch("/admin/users/ban/:id", banUserController);
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
