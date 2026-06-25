import type { Request, Response, NextFunction } from 'express';
import { checkPermission } from '../services/permisstion.service.js';
import { type Action, type Module, STATIC_ROLES } from '../constants/permissions.js';
import { AppError, ForbiddenException, UnauthorizedException } from '../utils/app-error.js';
import { asyncHandler } from '../config/asyncHandler.js';
import { ErrorCodeEnum } from '../utils/error-code.enum.js';

export const requirePermission = (module: Module, action: Action) => {
    return asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) {
                throw new AppError('Unauthorized: User context missing', 401);
            }

            if (req.user.role === STATIC_ROLES.ADMIN) {
                req.permissionScope = 'global';
                return next();
            }

            const { allowed, scope } = await checkPermission(
                req.user.id,
                req.user.roleId,
                module,
                action
            );

            if (!allowed || !scope) {
                throw new AppError(`Forbidden: Access denied for ${action} on ${module}`, 403);
            }

            req.permissionScope = scope;
            next();
        }
    )
};

export const requireAdmin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new UnauthorizedException("User not found", ErrorCodeEnum.ACCESS_UNAUTHORIZED)
        }

        if (req.user.role !== STATIC_ROLES.ADMIN) {
            throw new ForbiddenException("Access denied", ErrorCodeEnum.ACCESS_DENIED);
        }
        return next();
    }
)