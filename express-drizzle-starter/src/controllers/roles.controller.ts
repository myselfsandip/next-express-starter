import type { Request, Response } from "express";
import { asyncHandler } from "../config/asyncHandler.js";
import { createRoleSchema, updateRoleSchema } from "../validators/roles.validator.js";
import { createRole, getAllRoles, getRoleById, updateRole } from "../services/roles.service.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { logger } from "../config/winston.js";
import { STATIC_ROLES } from "../constants/permissions.js";
import { ForbiddenException } from "../utils/app-error.js";



export const createRoleController = asyncHandler(
    async (req: Request, res: Response) => {
        const parsedPayload = createRoleSchema.parse(req.body);

        if (parsedPayload.key === STATIC_ROLES.ADMIN) {
            throw new ForbiddenException("Cannot create ADMIN role");
        }

        const { roleKey, roleName, roleId } = await createRole(parsedPayload);
        logger.info(`New Role ${roleName} has been created. KEY : ${roleKey} | id: ${roleId} `);
        res.status(HTTPSTATUS.CREATED).json({
            success: true,
            message: "Role Created Successfully",
            data: {
                roleKey,
                roleName
            }
        })
    }
);


export const updateRoleController = asyncHandler(
    async (req: Request, res: Response) => {
        const parsedPayload = updateRoleSchema.parse(req.body);
        const { roleId } = req.params;
        const { description, name, roleKey } = await updateRole(parsedPayload, roleId);
        logger.info(`Role ${name} has been updated. KEY : ${roleKey} | id: ${roleId} `);
        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "Role Updated Successfully",
            data: {
                roleKey,
                roleName: name,
                description
            }
        })
    }
);


export const getAllRolesController = asyncHandler(
    async (req: Request, res: Response) => {
        const roles = await getAllRoles();
        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "All Roles fetched successfully",
            data: roles,
        })
    }
)
export const getRoleByIdController = asyncHandler(
    async (req: Request, res: Response) => {
        const { roleId } = req.params;
        const role = await getRoleById(roleId);
        res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "Roles fetched successfully",
            data: role,
        })
    }
)





