import { z } from "zod/v4";

export const recordPaymentSchema = z.object({
  amount: z
    .number("Amount is required")
    .positive("Amount must be greater than zero")
    .min(1, "Minimum payment is Rs. 1"),
  utrNumber: z
    .string()
    .min(1, "UTR number is required")
    .min(10, "UTR must be at least 10 characters")
    .max(22, "UTR must be under 22 characters")
    .regex(/^[A-Z0-9]+$/i, "UTR must contain only letters and numbers"),
  paymentDate: z
    .string()
    .min(1, "Payment date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date")
    .refine(
      (value) => new Date(value) <= new Date(),
      "Payment date cannot be in the future"
    ),
});

export type RecordPaymentFormData = z.infer<typeof recordPaymentSchema>;
