'use server'

import { auth } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import { signInSchema, type SignInField, type SignInState } from './schema'

function toFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Partial<Record<SignInField, string>> = {}

  for (const issue of issues) {
    const key = issue.path[0]
    if (key === 'email' || key === 'password') {
      fieldErrors[key] ??= issue.message
    }
  }

  return fieldErrors
}

export async function signInWithEmail(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const result = signInSchema.safeParse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  })

  if (!result.success) {
    return { fieldErrors: toFieldErrors(result.error.issues) }
  }

  const { error } = await auth.signIn.email({
    email: result.data.email,
    password: result.data.password,
  })

  if (error) {
    return { error: error.message || 'Invalid email or password. Try again.' }
  }

  redirect('/admin/cars')
}
