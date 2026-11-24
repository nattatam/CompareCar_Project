import { z } from 'zod'

type PasswordRule = {
  id: string
  label: string
  message: string
  test: (password: string) => boolean
}

export const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'At least 12 characters',
    message: 'Password must be at least 12 characters',
    test: (password) => password.length >= 12,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter (A-Z)',
    message: 'Password must include an uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter (a-z)',
    message: 'Password must include a lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    label: 'One number (0-9)',
    message: 'Password must include a number',
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: 'special',
    label: 'One special character',
    message: 'Password must include a special character',
    test: (password) => /[^A-Za-z0-9\s]/.test(password),
  },
] satisfies PasswordRule[]

export const CONFIRM_PASSWORD_RULE = {
  id: 'match',
  label: 'Passwords match',
  message: 'Passwords do not match',
  test: (password: string, confirmPassword: string) => password.length > 0 && password === confirmPassword,
}

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.email('Please enter a valid email address'),
    password: z.string().superRefine((password, ctx) => {
      for (const rule of PASSWORD_RULES) {
        if (!rule.test(password)) {
          ctx.addIssue({ code: 'custom', message: rule.message })
        }
      }
    }),
    confirmPassword: z.string(),
  })
  .refine((values) => CONFIRM_PASSWORD_RULE.test(values.password, values.confirmPassword), {
    path: ['confirmPassword'],
    message: CONFIRM_PASSWORD_RULE.message,
  })

export type SignUpField = 'name' | 'email' | 'password' | 'confirmPassword'

export type SignUpState = {
  error?: string
  fieldErrors?: Partial<Record<SignUpField, string>>
} | null
