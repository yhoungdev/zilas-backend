import express from "express";
import { getUserprofileController } from "../controllers/user/profile";
import {
  addExternalWalletController,
  getUserWallet,
} from "../controllers/user/wallet";
import { isAuthenticated } from "../utils/isAuthenticated";

const router = express.Router();

router.get("/user/profile/:id", isAuthenticated, getUserprofileController);
router.post("/user/wallet/add", isAuthenticated, addExternalWalletController);
router.get("/user/wallet/", isAuthenticated, getUserWallet);

export const defaultUsersRoute = router;
