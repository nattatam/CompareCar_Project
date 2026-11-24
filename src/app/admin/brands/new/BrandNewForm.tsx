'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().trim().min(1, 'Brand name is required'),
  model: z.string().trim().min(1, 'Model name is required'),
  subModel: z.string().trim().min(1, 'SubModel name is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function BrandNewForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      model: '',
      subModel: '',
    },
  })

  const { errors } = form.formState

  async function onSubmit(values: FormValues) {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/cars/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to add brand')
      }
      toast('Add Success', { position: 'top-right', className: '!bg-green-100 !text-green-500' })
      // router.push('/admin/brands')
      router.refresh()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message, { position: 'top-right', className: '!bg-red-100 !text-red-500' })
        // setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-border bg-card p-6">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Brand Name</FieldLabel>
        <Input id="name" placeholder="e.g. Toyota" aria-invalid={!!errors.name} {...form.register('name')} />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.model}>
        <FieldLabel htmlFor="model">Model Name</FieldLabel>
        <Input id="model" placeholder="e.g. Camry" aria-invalid={!!errors.model} {...form.register('model')} />
        <FieldError>{errors.model?.message}</FieldError>
      </Field>

      <Field data-invalid={!!errors.subModel}>
        <FieldLabel htmlFor="subModel">SubModel Name</FieldLabel>
        <Input id="subModel" placeholder="e.g. GLE" aria-invalid={!!errors.subModel} {...form.register('subModel')} />
        <FieldError>{errors.subModel?.message}</FieldError>
      </Field>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" asChild>
          <Link href="/admin/brands">Cancel</Link>
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
