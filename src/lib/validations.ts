import { z } from 'zod'

export const emailOtpSchema = z.object({
    email: z.string().email('Enter a valid email address'),
})

export const otpVerifySchema = z.object({
    email: z.string().email(),
    token: z.string().min(6).max(8),
})

export const contactSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
})

export const freeTrialSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
})

export const newsletterSchema = z.object({
    email: z.string().email('Enter a valid email address'),
})

export const walkInSchema = z.object({
    full_name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    source: z.string().default('walk_in'),
    interest: z.string().optional(),
})

export type EmailOtpInput = z.infer<typeof emailOtpSchema>
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>
export type ContactInput = z.infer<typeof contactSchema>
export type FreeTrialInput = z.infer<typeof freeTrialSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
export type WalkInInput = z.infer<typeof walkInSchema>