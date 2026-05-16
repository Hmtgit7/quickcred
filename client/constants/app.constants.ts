export const LOAN_CONSTANTS = {
  MIN_AMOUNT: 50_000,
  MAX_AMOUNT: 500_000,
  MIN_TENURE_DAYS: 30,
  MAX_TENURE_DAYS: 365,
  INTEREST_RATE: 12, // % per annum
  AMOUNT_STEP: 5_000,
} as const;

export const BRE_CONSTANTS = {
  MIN_AGE: 23,
  MAX_AGE: 50,
  MIN_MONTHLY_SALARY: 25_000,
  PAN_REGEX: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
} as const;

export const FILE_UPLOAD_CONSTANTS = {
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
  MAX_SIZE_LABEL: "5 MB",
  ALLOWED_MIME_TYPES: ["application/pdf", "image/jpeg", "image/png"] as const,
  ALLOWED_EXTENSIONS: ".pdf, .jpg, .jpeg, .png",
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const APP_NAME = "QuickCred";
export const API_PREFIX = "api";
