import { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { roles, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { verifyAccessToken } from '../utils/jwtTokens.js';
import { UnauthorizedException } from '../utils/app-error.js';
import { ErrorCodeEnum } from '../utils/error-code.enum.js';
import { asyncHandler } from '../config/asyncHandler.js';

export const authenticate = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Unauthorized: No token provided', ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND);
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);
        if (!decoded || !decoded.userId) {
            throw new UnauthorizedException('Unauthorized: Invalid token payload', ErrorCodeEnum.AUTH_INVALID_TOKEN);
        }
        const [result] = await db
            .select({
                user: users,
                role: roles
            })
            .from(users)
            .where(eq(users.id, decoded.userId))
            .innerJoin(roles, eq(users.roleId, roles.id))
            .limit(1);
        if (!result) {
            throw new UnauthorizedException('Unauthorized: User not found', ErrorCodeEnum.AUTH_USER_NOT_FOUND);
        }
        req.user = {
            ...result.user,
            role: result.role.key
        }
        next();
    }
)
