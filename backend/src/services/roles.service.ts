import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { roles } from "../db/schema";
import { createRoleSchemaType, updateRoleSchemaType } from "../validators/roles.validator";


export const createRole = async (data: createRoleSchemaType) => {
    const [result] = await db.insert(roles).values({
        ...data
    }).returning();
    return { roleName: result.name, roleKey: result.key, roleId: result.id };
}

export const updateRole = async (data: updateRoleSchemaType, roleId: string) => {
    const [result] = await db.update(roles).set({
        ...data
    }).where(and(eq(roles.id, roleId), eq(roles.isSystem, false))).returning();
    return { name: result.name, description: result.description, roleId: result.id, roleKey: result.key };
}


export const getAllRoles = async () => {
    const data = await db.select().from(roles).where(and(eq(roles.isSystem, false), eq(roles.isSystem, false)));
    return data;
}


export const getRoleById = async (roleId: string) => {
    const [data] = await db.select().from(roles).where(and(eq(roles.id, roleId), eq(roles.isSystem, false))).limit(1);
    return data;
}