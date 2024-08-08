import express from "express";
import { loginController , createAccountController } from "../controllers/auth";

const router = express.Router();

router.post('/login', loginController)

const authRouter = router;
export default authRouter;
