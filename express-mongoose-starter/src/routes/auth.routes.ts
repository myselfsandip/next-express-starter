import { Router } from "express";
import { loginController, registerController, userProfileController } from "../controllers/auth.controller.js";
import authMidddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/user", authMidddleware, userProfileController);


export default router;