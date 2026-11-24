'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { signInWithEmail } from './action'

export default function SignInForm() {
  const [state, formAction, pending] = useActionState(signInWithEmail, null)
  const emailError = state?.fieldErrors?.email
  const passwordError = state?.fieldErrors?.password

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Admin sign in</CardTitle>
        <CardDescription>Sign in to manage the car catalog.</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} noValidate className="space-y-4">
          {state?.error ? (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {state.error}
            </p>
          ) : null}

          <Field data-invalid={!!emailError}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              aria-invalid={!!emailError}
              disabled={pending}
            />
            <FieldError>{emailError}</FieldError>
          </Field>

          <Field data-invalid={!!passwordError}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              aria-invalid={!!passwordError}
              disabled={pending}
            />
            <FieldError>{passwordError}</FieldError>
          </Field>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
