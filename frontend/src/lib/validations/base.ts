import { z } from "zod"
import { parsePhoneNumberWithError } from "libphonenumber-js";

export const passwordRuleZod = z.string().min(6, "Password must be at least 6 characters long");

export const optionalString = z.string().nullish().transform((val) => val || undefined);

export const phoneValidation = z.string()
    .min(1, "Phone number is required")
    .refine((value) => {
        if (!value || value === '') return true;

        try {
            // Clean the input
            const cleaned = value.replace(/[\s\-()]/g, '');
            const phoneNumber = cleaned.startsWith("+971")
                ? parsePhoneNumberWithError(cleaned)
                : parsePhoneNumberWithError(`+971${cleaned}`);
            return phoneNumber.isValid() && phoneNumber.country === 'AE';
        } catch (error) {
            return false;
        }
    }, {
        message: "Invalid UAE phone number. Please enter a valid UAE mobile number (e.g., 50 123 4567)"
    })
    .transform((value) => {
        if (!value || value === '') return undefined;

        const cleaned = value.replace(/[\s\-()]/g, '');
        const phoneNumber = cleaned.startsWith("+971")
            ? parsePhoneNumberWithError(cleaned)
            : parsePhoneNumberWithError(`+971${cleaned}`);

        // Convert E164Number to string
        return String(phoneNumber.number);
    })
    .optional();

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
