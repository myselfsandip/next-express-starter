import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../config/asyncHandler.js";
import { UnauthorizedException } from "../utils/app-error.js";
import { ErrorCodeEnum } from "../utils/error-code.enum.js";
import { verifyToken } from "../utils/jwtTokens.js";
import { logger } from "../config/winston.js";


const authMidddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        //Take Req Header
        const authHeader = req.headers.authorization;
        logger.info(`AUTH HEADER : ${authHeader}`);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException('Unauthorized: No token provided', ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND);
        }

        //Verify Token
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        //Assign User ID to Request Object
        const userId = decoded.userId;

        req.userId = userId;
        next();
    }
)

export default authMidddleware;