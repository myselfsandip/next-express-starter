import { z } from "zod";

const passwordRule = z.string().min(6, "Password must be at least 6 characters long");

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.email("Invalid email address").min(1, "Email is required"),
    roleId: z.string().min(1, { message: "Role  is required" }),
    password: passwordRule,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
