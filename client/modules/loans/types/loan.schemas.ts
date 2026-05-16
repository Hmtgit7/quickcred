import { z } from "zod/v4";
import { LOAN_CONSTANTS } from "@/constants/app.constants";

export const createLoanSchema = z.object({
    principalAmount: z
        .number("Loan amount is required")
        .min(
            LOAN_CONSTANTS.MIN_AMOUNT,
            `Minimum loan amount is ₹${LOAN_CONSTANTS.MIN_AMOUNT.toLocaleString("en-IN")}`
        )
        .max(
            LOAN_CONSTANTS.MAX_AMOUNT,
            `Maximum loan amount is ₹${LOAN_CONSTANTS.MAX_AMOUNT.toLocaleString("en-IN")}`
        ),
    tenureDays: z
        .number("Tenure is required")
        .min(
            LOAN_CONSTANTS.MIN_TENURE_DAYS,
            `Minimum tenure is ${LOAN_CONSTANTS.MIN_TENURE_DAYS} days`
        )
        .max(
            LOAN_CONSTANTS.MAX_TENURE_DAYS,
            `Maximum tenure is ${LOAN_CONSTANTS.MAX_TENURE_DAYS} days`
        ),
});

export type CreateLoanFormData = z.infer<typeof createLoanSchema>;
