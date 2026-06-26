import { Request, Response } from "express";
import { asyncHandler } from "../config/asyncHandler.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { User } from "../models/User.js";
import { NotFoundException } from "../utils/app-error.js";
import { ErrorCodeEnum } from "../utils/error-code.enum.js";
import { logger } from "../config/winston.js";


export const registerController = asyncHandler(
    async (req: Request, res: Response) => {
        const parsedPayload = registerSchema.parse(req.body);

        const { user, token } = await registerUser(parsedPayload);

        return res.status(HTTPSTATUS.CREATED).json({
            success: true,
            message: "User registered successfully",
            user,
            token,
        })
    }
)
export const loginController = asyncHandler(
    async (req: Request, res: Response) => {
        const parsedPayload = loginSchema.parse(req.body);

        const { user, token } = await loginUser(parsedPayload);

        return res.status(HTTPSTATUS.CREATED).json({
            success: true,
            message: "User logged in successfully",
            user,
            token,
        })
    }
)

export const userProfileController = asyncHandler(
    async (req: Request, res: Response) => {
        //Found User
        logger.info(`UserId: ${req.userId}`);
        const user = await User.findById(req.userId);
        if (!user) {
            throw new NotFoundException("User not found", ErrorCodeEnum.AUTH_USER_NOT_FOUND);
        }

        //Add User In Response
        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "User data fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan,
            },
        })
    }
)