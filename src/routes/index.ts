import express from "express";
import { getUserprofileController } from "../controllers/user/profile";

const router = express.Router();

router.get("/user/profile/:id", getUserprofileController);

export const defaultUsersRoute = router;
