import { z } from "zod";

export const leadValidationSchema = z.object({

    name: z
        .string()
        .trim()
        .min(1, "Name is required"),

    email: z
        .email("Invalid email address"),

    phone: z
        .string()
        .trim()
        .regex(
            /^[6-9]\d{9}$/,
            "Invalid phone number"
        ),

    company: z
        .string()
        .trim()
        .min(1, "Company is required"),

    status: z.enum([
        "new",
        "contacted",
        "converted",
        "lost"
    ]),

    source: z.enum([
        "website",
        "referral",
        "social media",
        "other"
    ]),

    value: z
        .number()
        .nonnegative()
        .optional(),

    assignedTo: z
        .string()
        .trim()
        .min(1, "Assigned To is required"),

    notes: z
        .string()
        .trim()
        .optional(),

    address: z
        .string()
        .trim()
        .min(5, "Address is required"),

    activities: z
        .array(
            z.string().trim()
        )
        .optional()

});