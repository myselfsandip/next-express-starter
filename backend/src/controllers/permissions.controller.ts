import { Request, Response } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { HTTPSTATUS } from "../config/http.config";
import {
    upsertRolePermissionsSchema,
    getRolePermissionsParamsSchema,
    setUserPermissionsSchema,
    getUserPermissionsParamsSchema,
} from "../validators/permissions.validator";
import {
    upsertRolePermissions,
    getRolePermissions,
    setUserPermissions,
    getUserPermissions,
} from "../services/permisstion.service";

export const upsertRolePermissionsController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = upsertRolePermissionsSchema.parse({
            roleId: req.params.role,
            permissions: req.body.permissions
        });

        const data = await upsertRolePermissions(body);

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "Role permissions updated successfully",
            data,
        });
    }
);

export const getRolePermissionsController = asyncHandler(
    async (req: Request, res: Response) => {
        const { roleId } = getRolePermissionsParamsSchema.parse({ roleId: req.params.role, });

        const data = await getRolePermissions(roleId);

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "Role permissions fetched successfully",
            data,
        });
    }
);

export const setUserPermissionsController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = setUserPermissionsSchema.parse({
            ...req.body,
            userId: req.params.userId,
        });

        const data = await setUserPermissions(body);

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "User permissions updated successfully",
            data,
        });
    }
);

export const getUserPermissionsController = asyncHandler(
    async (req: Request, res: Response) => {
        const { userId } = getUserPermissionsParamsSchema.parse(req.params);

        const data = await getUserPermissions(userId);

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "User permissions fetched successfully",
            data,
        });
    }
);


