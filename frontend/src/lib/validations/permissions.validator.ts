import { ACTIONS, MODULES, SCOPES } from "@/constants/permissions";
import { z } from "zod";

export const moduleEnum = z.nativeEnum(MODULES);
export const actionEnum = z.nativeEnum(ACTIONS);
export const scopeEnum = z.nativeEnum(SCOPES);

export const upsertRolePermissionsSchema = z.object({
    roleId: z.string(),
    permissions: z.array(
        z.object({
            module: moduleEnum,
            action: actionEnum,
            scope: scopeEnum,
        })
    ),
});

export const getRolePermissionsParamsSchema = z.object({
    roleId: z.string(),
});

export const setUserPermissionsSchema = z.object({
    userId: z.string().min(1),
    permissions: z.array(
        z.object({
            module: moduleEnum,
            action: actionEnum,
            scope: scopeEnum,
            isDenied: z.boolean().optional().default(false),
        })
    ),
});

export const getUserPermissionsParamsSchema = z.object({
    userId: z.string().min(1),
});

export type UpsertRolePermissionsData = z.infer<typeof upsertRolePermissionsSchema>;
export type SetUserPermissionsData = z.infer<typeof setUserPermissionsSchema>;
export type RolePermissions = z.infer<typeof upsertRolePermissionsSchema>["permissions"][number];
export type UserPermission = z.infer<typeof setUserPermissionsSchema>["permissions"][number];
