import { Router } from "express";
import { HTTPSTATUS } from "../config/http.config.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/permisstion.middleware.js";
import authRoutes from "./auth.routes.js";
import permissionsRoutes from "./permissions.routes.js";
import rolesRoutes from "./roles.routes.js";



const router = Router();


router.get("/health", (req, res) => {
    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Health 100% Ok 🥴",
    })
});
router.use("/auth", authRoutes);
router.use("/roles", authenticate, rolesRoutes);
router.use("/permissions", authenticate, requireAdmin, permissionsRoutes);



export default router;