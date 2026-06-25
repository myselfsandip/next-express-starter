import type { UserId } from '../@types/index.js';
import { type Action, type Module, type Scope, SCOPES } from '../constants/permissions.js';
import { db } from '../db/index.js';
import { rolePermissions, userPermissions, users } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';
import { type SetUserPermissionsSchemaType, type UpsertRolePermissionsSchemaType } from '../validators/permissions.validator.js';
import { logger } from '../config/winston.js';

export const checkPermission = async (
    userId: UserId,
    roleId: string,
    module: Module,
    action: Action
) => {
    // 1. Check User Override
    const [override] = await db
        .select()
        .from(userPermissions)
        .where(
            and(
                eq(userPermissions.userId, userId),
                eq(userPermissions.module, module),
                eq(userPermissions.action, action)
            )
        )
        .limit(1);

    if (override) {
        // If 'isDenied' is true, block access regardless of role
        if (override.isDenied) return { allowed: false, scope: null };
        return { allowed: true, scope: override.scope };
    }

    // 2. Check Role Default
    const [rolePerm] = await db
        .select()
        .from(rolePermissions)
        .where(
            and(
                eq(rolePermissions.roleId, roleId),
                eq(rolePermissions.module, module),
                eq(rolePermissions.action, action)
            )
        )
        .limit(1);

    if (rolePerm) {
        return { allowed: true, scope: rolePerm.scope };
    }

    return { allowed: false, scope: null };
};

export const upsertRolePermissions = async (
    data: UpsertRolePermissionsSchemaType
) => {
    const { roleId, permissions } = data;

    return await db.transaction(async (tx) => {
        await tx.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

        if (permissions.length > 0) {
            await tx.insert(rolePermissions).values(
                permissions.map((p) => ({
                    roleId,
                    module: p.module,
                    action: p.action,
                    scope: p.scope,
                }))
            );
        }

        const rows = await tx
            .select()
            .from(rolePermissions)
            .where(eq(rolePermissions.roleId, roleId));

        return rows;
    });
};

export const getRolePermissions = async (roleId: string) => {
    const rows = await db
        .select()
        .from(rolePermissions)
        .where(eq(rolePermissions.roleId, roleId));

    return rows;
};

export const setUserPermissions = async (
    data: SetUserPermissionsSchemaType
) => {
    const { userId, permissions } = data;

    return await db.transaction(async (tx) => {
        await tx.delete(userPermissions).where(eq(userPermissions.userId, userId));

        if (permissions.length > 0) {
            await tx.insert(userPermissions).values(
                permissions.map((p) => ({
                    userId,
                    module: p.module,
                    action: p.action,
                    scope: p.scope,
                    isDenied: p.isDenied ?? false,
                }))
            );
        }

        const rows = await tx
            .select()
            .from(userPermissions)
            .where(eq(userPermissions.userId, userId));


        logger.info(`User ID: ${userId} has new Permissions: ${rows}`);

        return rows;
    });
};

export const getUserPermissions = async (userId: string) => {
    const overrides = await db
        .select()
        .from(userPermissions)
        .where(eq(userPermissions.userId, userId));

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

    if (!user) {
        return { overrides, effective: [] as { module: string; action: string; scope: string }[] };
    }

    const rolePerms = await db
        .select()
        .from(rolePermissions)
        .where(eq(rolePermissions.roleId, user.roleId));

    const map = new Map<string, { module: string; action: string; scope: string }>();

    for (const rp of rolePerms) {
        const key = `${rp.module}:${rp.action}`;
        map.set(key, { module: rp.module, action: rp.action, scope: rp.scope });
    }

    for (const up of overrides) {
        const key = `${up.module}:${up.action}`;
        if (up.isDenied) {
            map.delete(key);
        } else {
            map.set(key, { module: up.module, action: up.action, scope: up.scope });
        }
    }

    const effective = Array.from(map.values());
    return { overrides, effective };
};

