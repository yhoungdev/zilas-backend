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

router.get("/user/products/view/:id", isAuthenticated, viewProduct);

export const defaultUsersRoute = router;
