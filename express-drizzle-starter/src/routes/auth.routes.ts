import { Router } from "express";
import { loginController, profileController, refreshController, registerController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { loginLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// router.post("/register", registerController); //for initial admin add - after that it gets off
router.post("/login", loginLimiter, loginController);
router.post("/refresh", refreshController);
router.get("/profile", authenticate, profileController);

export default router;