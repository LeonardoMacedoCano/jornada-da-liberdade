import { z } from 'zod'
import { ErrorCode } from './errors'

// Schema messages double as ErrorCode values — validate.ts forwards
// `issue.message` straight through as `error` in the response.
const nonNegativeNumber = () =>
  z.coerce.number({ invalid_type_error: ErrorCode.INVALID_NON_NEGATIVE_FIELD })
    .refine(v => v >= 0, { message: ErrorCode.INVALID_NON_NEGATIVE_FIELD })

const returnRate = () =>
  z.coerce.number({ invalid_type_error: ErrorCode.INVALID_RETURN_RATE })
    .refine(v => v >= 0 && v <= 100, { message: ErrorCode.INVALID_RETURN_RATE })

export const updateProgressSchema = z.object({
  investedAmount: nonNegativeNumber().optional(),
  monthlyPassiveIncome: nonNegativeNumber().optional(),
  monthlyContribution: nonNegativeNumber().optional(),
  annualReturnRate: returnRate().optional(),
})

export const updateSettingsSchema = z.object({
  name: z.string().trim().min(1, ErrorCode.NAME_CANNOT_BE_EMPTY).optional(),
  username: z.string().regex(/^[a-z0-9-]+$/, ErrorCode.INVALID_USERNAME_FORMAT).optional(),
  sharePublicProfile: z.boolean().optional(),
  showFinancialValues: z.boolean().optional(),
})

export const googleAuthSchema = z.object({
  credential: z.string({
    required_error: ErrorCode.MISSING_GOOGLE_CREDENTIAL,
    invalid_type_error: ErrorCode.MISSING_GOOGLE_CREDENTIAL,
  }).min(1, ErrorCode.MISSING_GOOGLE_CREDENTIAL),
})
