import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type SignInField = 'email' | 'password'

export type SignInState = {
  error?: string
  fieldErrors?: Partial<Record<SignInField, string>>
} | null
