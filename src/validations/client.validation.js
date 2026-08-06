import { z } from "zod";
import mongoose from "mongoose";

const objectIdValidator = (value) =>
    mongoose.Types.ObjectId.isValid(value);

export const clientValidationSchema = z.object({

    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name is too long"),

    email: z
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    phone: z
        .string()
        .trim()
        .regex(
            /^[6-9]\d{9}$/,
            "Phone number must be a valid 10 digit Indian number"
        ),

    company: z
        .string()
        .trim()
        .min(2, "Company name is required"),

    leadId: z
        .string()
        .refine(objectIdValidator, {
            message: "Invalid Lead ID"
        }),

    status: z
        .enum([
            "active",
            "paused",
            "completed",
            "cancelled"
        ])
        .default("active"),

    website: z
        .url("Invalid website URL")
        .optional()
        .or(z.literal("")),

    contractValue: z
        .number()
        .nonnegative("Contract value cannot be negative")
        .optional(),

    onBoardingDate: z
        .date()
        .optional(),

    renewalDate: z
        .date()
        .optional(),

    assignedTo: z
        .string()
        .trim()
        .optional(),

    address: z
        .string()
        .trim()
        .min(5, "Address is required"),

    projects: z
        .array(
            z.string().refine(objectIdValidator, {
                message: "Invalid Project ID"
            })
        )
        .optional()
        .default([]),

    notes: z
        .string()
        .optional()
        .default(""),

    activities: z
        .array(z.string())
        .optional()
        .default([])

});