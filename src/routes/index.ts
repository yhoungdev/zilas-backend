import express from "express";
import { getUserprofileController } from "../controllers/user/profile";
import {
  addExternalWalletController,
  getUserWallet,
} from "../controllers/user/wallet";
import { isAuthenticated } from "../../utils/isAuthenticated";
import {
  fetchAllProducts,
  fetchProductsByUserRank,
  submitPendingHistroyController,
  usersProductHistory,
  viewProduct,
} from "../controllers/user/products";

const router = express.Router();

router.get("/user/profile", isAuthenticated, getUserprofileController);
router.post("/user/wallet/add", isAuthenticated, addExternalWalletController);
router.get("/user/wallet/", isAuthenticated, getUserWallet);
router.get("/user/products", isAuthenticated, fetchAllProducts);
router.get(
  "/user/products/base_on_rank",
  isAuthenticated,
  fetchProductsByUserRank,
);

router.post("/user/products/view/:id", isAuthenticated, viewProduct);
router.get("/user/products/history", isAuthenticated, usersProductHistory);
router.post(
  "/user/products/history/update/:recordId",
  isAuthenticated,
  submitPendingHistroyController,
);

export const defaultUsersRoute = router;
