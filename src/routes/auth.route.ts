import express from "express";
import { loginController , createAccountController } from "../controllers/auth";

const router = express.Router();

router.post("/auth/login", loginController);
router.post("/auth/register", createAccountController);

const authRouter = router;
export default authRouter;
