import express from "express";
import { getUserprofileController } from "../controllers/user/profile";
import {
  addExternalWalletController,
  getUserWallet,
} from "../controllers/user/wallet";
import { isAuthenticated } from "../../utils/isAuthenticated";
import { fetchAllProducts } from "../controllers/user/products";

const router = express.Router();

router.get("/user/profile/:id", isAuthenticated, getUserprofileController);
router.post("/user/wallet/add", isAuthenticated, addExternalWalletController);
router.get("/user/wallet/", isAuthenticated, getUserWallet);
router.get("/user/products", isAuthenticated, fetchAllProducts);


export const defaultUsersRoute = router;
