import { Router } from "express";
import { HTTPSTATUS } from "../config/http.config.js";
import authRoutes from "./auth.routes.js";




const router = Router();


router.get("/health", (req, res) => {
    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Health 100% Ok 🥴",
    })
});


router.use("/auth", authRoutes);



export default router;