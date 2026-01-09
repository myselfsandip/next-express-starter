import { z } from "zod"

export const passwordRuleZod = z.string().min(6, "Password must be at least 6 characters long");

export const optionalString = z.string().nullish().transform((val) => val || undefined);

export const optionalNumeric = z.string()
    .regex(/^\d+(\.\d+)?$/, "Must be a valid number")
    .transform(Number)
    .nullish()
    .transform((val) => val || undefined);

export const dateString = z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .refine((str) => !isNaN(new Date(str).getTime()), "Invalid date");

export const optionalDateString = z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
    .refine((str) => !isNaN(new Date(str).getTime()), "Invalid date")
    .nullish()
    .transform((val) => val || undefined);

export const approveRejectZodEnum = z.enum(['pending', 'approved', 'rejected']);
export type approveRejectZodType = z.infer<typeof approveRejectZodEnum>;
