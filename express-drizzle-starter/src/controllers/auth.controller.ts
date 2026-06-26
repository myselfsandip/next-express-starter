import { asyncHandler } from "../config/asyncHandler.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import * as authService from "../services/auth.service.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { getUserPermissions } from "../services/permisstion.service.js";
import type { Request, Response } from "express";

export const registerController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = registerSchema.parse(req.body);

        const { user, accessToken, refreshToken } = await authService.registerUser(body);

        res.status(HTTPSTATUS.CREATED).json({
            message: "User registered successfully",
            data: {
                user,
                accessToken,
                refreshToken
            }
        });
    }
);

export const loginController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = loginSchema.parse(req.body);

        const { user, accessToken, refreshToken } = await authService.loginUser(body);

        res.status(HTTPSTATUS.OK).json({
            message: "Login successful",
            data: {
                user,
                accessToken,
                refreshToken
            }
        });
    }
);

export const refreshController = asyncHandler(
    async (req: Request, res: Response) => {
        // Or Header : req.headers['x-refresh-token']
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Refresh token is required" });
        }

        const { accessToken, newRefreshToken } = await authService.refreshUserToken(refreshToken);

        res.status(HTTPSTATUS.OK).json({
            message: "Token refreshed successfully",
            data: {
                accessToken,
                refreshToken: newRefreshToken
            }
        });
    }
);

export const profileController = asyncHandler(
    async (req: Request, res: Response) => {
        const user = req.user;

        if (!user) {
            return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "User not found" });
        }

        const { refreshToken, password, ...userProfile } = user;

        const { effective } = await getUserPermissions(user?.id);

        res.status(HTTPSTATUS.OK).json({
            message: "Profile fetched successfully",
            data: userProfile,
            permissions: effective
        });
    }
);
