import { z } from "zod/v4";
import { EmploymentMode } from "@/types/enums";
import { BRE_CONSTANTS } from "@/constants/app.constants";

export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be under 100 characters"),
    pan: z
        .string()
        .min(1, "PAN is required")
        .regex(BRE_CONSTANTS.PAN_REGEX, "Invalid PAN format. Expected: ABCDE1234F")
        .transform((v) => v.toUpperCase()),
    dob: z
        .string()
        .min(1, "Date of birth is required")
        .refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
    monthlySalary: z
        .coerce.number("Salary must be a number")
        .min(1, "Monthly salary is required")
        .positive("Salary must be positive"),
    employmentMode: z.enum(EmploymentMode, "Please select employment mode"),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
