'use server'

import { auth } from '@/lib/auth/server'
import { getAllowedList, isAllowedEmail } from '@/lib/auth/signup-allowlist'
import { redirect } from 'next/navigation'
import { signUpSchema, type SignUpField, type SignUpState } from './schema'

function toFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Partial<Record<SignUpField, string>> = {}

  for (const issue of issues) {
    const key = issue.path[0]
    if (key === 'name' || key === 'email' || key === 'password' || key === 'confirmPassword') {
      fieldErrors[key] ??= issue.message
    }
  }

  return fieldErrors
}

export async function signUpWithEmail(_prevState: SignUpState, formData: FormData): Promise<SignUpState> {
  const result = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!result.success) {
    return { fieldErrors: toFieldErrors(result.error.issues) }
  }

  const allowedEmails = getAllowedList(process.env.ALLOWED_EMAILS)
  if (allowedEmails.length === 0) {
    return { error: 'Sign-up is not configured. Contact an administrator.' }
  }

  const { email: rawEmail, name, password } = result.data
  const email = rawEmail.trim().toLowerCase()
  if (!isAllowedEmail(email, allowedEmails)) {
    return { fieldErrors: { email: 'Please use an approved email address.' } }
  }

  const { error } = await auth.signUp.email({
    email,
    name,
    password,
  })

  if (error) {
    return { error: error.message || 'Failed to create account' }
  }

  redirect('/auth/sign-in')
}
