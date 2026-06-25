import { z } from "zod";
import { optionalString } from "./base.js";

export const createRoleSchema = z.object({
    name: z.string().min(1, "Role name is required"),
    key: z.string().min(1, "Role key is required"),
    description: z.string().min(1, { message: "Description is required" }),
});


export const updateRoleSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
})



export type createRoleSchemaType = z.infer<typeof createRoleSchema>;
export type updateRoleSchemaType = z.infer<typeof updateRoleSchema>;