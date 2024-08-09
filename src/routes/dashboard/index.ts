import express from "express";
import { listAllUsersController } from "../../controllers/dashboard/users";

const router = express.Router();

router.get("/admin/users", listAllUsersController);

export default router;
