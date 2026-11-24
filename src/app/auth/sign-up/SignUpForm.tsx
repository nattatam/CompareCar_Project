'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Check, Circle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { signUpWithEmail } from './action'
import { CONFIRM_PASSWORD_RULE, PASSWORD_RULES } from './schema'

function PasswordRequirements({ password, confirmPassword }: { password: string; confirmPassword: string }) {
  const checks = [
    ...PASSWORD_RULES.map((rule) => ({ id: rule.id, label: rule.label, met: rule.test(password) })),
    {
      id: CONFIRM_PASSWORD_RULE.id,
      label: CONFIRM_PASSWORD_RULE.label,
      met: CONFIRM_PASSWORD_RULE.test(password, confirmPassword),
    },
  ]
  const allMet = checks.every((check) => check.met)

  return (
    <div className="space-y-1.5">
      <ul id="password-requirements" aria-label="Password requirements" className="grid gap-1">
        {checks.map((check) => (
          <li
            key={check.id}
            className={cn('flex items-center gap-2 text-xs', check.met ? 'text-foreground' : 'text-muted-foreground')}
          >
            {check.met ? (
              <Check className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            ) : (
              <Circle className="size-3.5 shrink-0" aria-hidden="true" />
            )}
            <span>{check.label}</span>
            <span className="sr-only">{check.met ? 'met' : 'not met'}</span>
          </li>
        ))}
      </ul>
      {allMet ? (
        <p role="status" className="flex items-center gap-1.5 text-xs text-primary">
          <Check className="size-3.5 shrink-0" aria-hidden="true" />
          Password meets all requirements.
        </p>
      ) : null}
    </div>
  )
}

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpWithEmail, null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const nameError = state?.fieldErrors?.name
  const emailError = state?.fieldErrors?.email
  const passwordError = state?.fieldErrors?.password
  const confirmPasswordError = state?.fieldErrors?.confirmPassword

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Admin sign up</CardTitle>
        <CardDescription>Create an admin account.</CardDescription>
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

          <Field data-invalid={!!nameError}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={!!nameError}
              disabled={pending}
            />
            <FieldError>{nameError}</FieldError>
          </Field>

          <Field data-invalid={!!emailError}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              autoComplete="new-password"
              placeholder="Create a password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={!!passwordError}
              aria-describedby="password-requirements"
              disabled={pending}
            />
            <PasswordRequirements password={password} confirmPassword={confirmPassword} />
            <FieldError>{passwordError}</FieldError>
          </Field>

          <Field data-invalid={!!confirmPasswordError}>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-invalid={!!confirmPasswordError}
              aria-describedby="password-requirements"
              disabled={pending}
            />
            <FieldError>{confirmPasswordError}</FieldError>
          </Field>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
