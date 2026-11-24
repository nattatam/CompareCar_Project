'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { Controller, useForm, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DRIVETRAIN_OPTIONS, MOTOR_TYPE_OPTIONS } from '@/constants/constants'
import { carFormSchema, type CarFormValues, type CarInput } from '@/lib/schema'

interface Option {
  id: string
  name: string
}

interface ModelOption extends Option {
  brandId: string
  subModels: Option[]
}

interface PowertrainOption {
  id: string
  type: string
  subType: string
}

interface Meta {
  brands: Option[]
  models: ModelOption[]
  categories: Option[]
  powertrains: PowertrainOption[]
}

const DEFAULT_VALUES: CarFormValues = {
  name: '',
  brandId: '',
  modelId: '',
  subModelId: '',
  powerTrainId: '',
  categoryCarId: '',
  year: '',
  price: '',
  image: '',
  officialUrl: '',
  spec: {
    powerKw: '',
    torque: '',
    topSpeed: '',
    acceleration: '',
    drivetrain: DRIVETRAIN_OPTIONS[0],
    motorType: MOTOR_TYPE_OPTIONS[0],
    groundClearance: '',
    weight: '',
    seats: '',
    trunkCapacity: '',
    trunkCapacityMax: '',
    turningRadius: '',
    dimension: { length: '', width: '', height: '', wheelbase: '' },
    battery: {
      type: 'LFP',
    },
    range: {},
    charging: {},
  },
}

type CarFormControl = ReturnType<typeof useForm<CarFormValues, unknown, CarInput>>['control']

interface SelectOption {
  value: string
  label: string
}

function SelectField({
  control,
  name,
  id,
  label,
  options,
  placeholder,
  disabled,
  error,
}: {
  control: CarFormControl
  name: FieldPath<CarFormValues>
  id: string
  label: string
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: string
}) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={(field.value as string) ?? ''}
            items={options.map((option) => ({ value: option.value, label: option.label }))}
            onValueChange={(nextValue) => field.onChange(nextValue)}
            disabled={disabled}
          >
            <SelectTrigger id={id} aria-invalid={!!error || undefined} className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <FieldError>{error}</FieldError>
    </Field>
  )
}

function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-4 sm:grid sm:grid-cols-2">{children}</FieldGroup>
      </CardContent>
    </Card>
  )
}

function splitDriveModes(value: string | string[]) {
  if (Array.isArray(value)) return value

  return value
    .split(',')
    .map((mode) => mode.trim())
    .filter((mode) => mode !== '')
}

export default function CarForm() {
  const [meta, setMeta] = useState<Meta | null>(null)
  const [metaError, setMetaError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const [created, setCreated] = useState<{ id?: string } | null>(null)

  const form = useForm<CarFormValues, unknown, CarInput>({
    resolver: zodResolver(carFormSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const brandId = form.watch('brandId')
  const modelId = form.watch('modelId')

  const { errors, isSubmitting } = form.formState

  const brandOptions = meta?.brands ?? []
  const modelOptions = (meta?.models ?? []).filter((model) => model.brandId === brandId)
  const subModelOptions = (meta?.models ?? []).find((model) => model.id === modelId)?.subModels ?? []

  useEffect(() => {
    let cancelled = false

    async function loadMeta() {
      try {
        const res = await fetch('/api/cars/meta')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as Meta
        if (!cancelled) {
          setMeta(data)
          setMetaError(null)
        }
      } catch {
        if (!cancelled) setMetaError('ไม่สามารถโหลดข้อมูลแบรนด์/รุ่น/หมวดหมู่/ระบบส่งกำลังได้')
      }
    }

    loadMeta()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  // Cascade resets: changing brand clears model + submodel, changing model clears submodel.
  useEffect(() => {
    form.setValue('modelId', '')
    form.setValue('subModelId', '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId])

  useEffect(() => {
    form.setValue('subModelId', '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId])

  async function onValid(data: CarInput) {
    setFormError(null)

    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = (await res.json().catch(() => null)) as { id?: string; message?: string; errors?: Record<string, string> } | null

      if (!res.ok) {
        const entries = Object.entries(json?.errors ?? {})
        if (entries.length > 0) {
          for (const [field, message] of entries) {
            form.setError(field as FieldPath<CarFormValues>, { type: 'server', message })
          }
        } else {
          setFormError(json?.message ?? 'บันทึกข้อมูลไม่สำเร็จ')
        }
        return
      }

      setCreated({ id: json?.id })
    } catch {
      setFormError('เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ')
    }
  }

  function resetForm() {
    form.reset(DEFAULT_VALUES)
    setFormError(null)
    setCreated(null)
  }

  if (created) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">บันทึกข้อมูลรถสำเร็จ</h1>
              {created.id ? (
                <p className="text-sm text-muted-foreground">
                  Car ID: <span className="font-mono tabular-nums text-foreground">{created.id}</span>
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button type="button" onClick={resetForm} className="cursor-pointer">
                เพิ่มรถคันใหม่
              </Button>
              <Button asChild variant="outline" className="cursor-pointer">
                <Link href="/">กลับไปที่แคตตาล็อก</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">เพิ่มข้อมูลรถ</h1>
        <p className="mt-1 text-sm text-muted-foreground">กรอกข้อมูลรถและสเปกให้ครบถ้วน ระบบจะบันทึกเข้าฐานข้อมูล</p>
      </header>

      {formError ? (
        <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      {metaError ? (
        <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {metaError}{' '}
          <button type="button" className="cursor-pointer underline" onClick={() => setReloadKey((key) => key + 1)}>
            ลองใหม่
          </button>
        </p>
      ) : null}

      <form onSubmit={form.handleSubmit(onValid)} className="flex flex-col gap-5" noValidate>
        <FormSection title="ข้อมูลรถ" description="ข้อมูลพื้นฐานของรถ">
          <Field data-invalid={!!errors.name} className="sm:col-span-2">
            <FieldLabel htmlFor="name">ชื่อรถ</FieldLabel>
            <Input id="name" placeholder="เช่น Tesla Model 3 Long Range" autoComplete="off" aria-invalid={!!errors.name} {...form.register('name')} />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <SelectField
            control={form.control}
            name="brandId"
            id="brandId"
            label="แบรนด์"
            placeholder={brandOptions.length ? 'เลือกแบรนด์' : 'กำลังโหลด...'}
            disabled={!brandOptions.length}
            options={brandOptions.map((brand) => ({ value: brand.id, label: brand.name }))}
            error={errors.brandId?.message}
          />

          <SelectField
            control={form.control}
            name="modelId"
            id="modelId"
            label="รุ่น"
            placeholder={brandId ? (modelOptions.length ? 'เลือกรุ่น' : 'ไม่มีรุ่นในแบรนด์นี้') : 'เลือกแบรนด์ก่อน'}
            disabled={!brandId || !modelOptions.length}
            options={modelOptions.map((model) => ({ value: model.id, label: model.name }))}
            error={errors.modelId?.message}
          />

          <SelectField
            control={form.control}
            name="subModelId"
            id="subModelId"
            label="รุ่นย่อย"
            placeholder={modelId ? (subModelOptions.length ? 'เลือกรุ่นย่อย' : 'ไม่มีรุ่นย่อยในรุ่นนี้') : 'เลือกรุ่นก่อน'}
            disabled={!modelId || !subModelOptions.length}
            options={subModelOptions.map((subModel) => ({ value: subModel.id, label: subModel.name }))}
            error={errors.subModelId?.message}
          />

          <SelectField
            control={form.control}
            name="categoryCarId"
            id="categoryCarId"
            label="ประเภทรถ"
            placeholder={meta ? 'เลือกประเภทรถ' : 'กำลังโหลด...'}
            disabled={!meta}
            options={(meta?.categories ?? []).map((category) => ({ value: category.id, label: category.name }))}
            error={errors.categoryCarId?.message}
          />

          <SelectField
            control={form.control}
            name="powerTrainId"
            id="powerTrainId"
            label="ระบบส่งกำลัง"
            placeholder={meta ? 'เลือกระบบส่งกำลัง' : 'กำลังโหลด...'}
            disabled={!meta}
            options={(meta?.powertrains ?? []).map((powertrain) => ({
              value: powertrain.id,
              label: powertrain.subType && powertrain.subType !== powertrain.type ? `${powertrain.type} · ${powertrain.subType}` : powertrain.type,
            }))}
            error={errors.powerTrainId?.message}
          />

          <Field data-invalid={!!errors.year}>
            <FieldLabel htmlFor="year">ปี</FieldLabel>
            <Input
              id="year"
              type="number"
              inputMode="numeric"
              step="1"
              min="1900"
              max="2100"
              placeholder="2026"
              aria-invalid={!!errors.year}
              {...form.register('year')}
            />
            <FieldError>{errors.year?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.price}>
            <FieldLabel htmlFor="price">ราคา (บาท)</FieldLabel>
            <Input
              id="price"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              placeholder="1500000"
              aria-invalid={!!errors.price}
              {...form.register('price')}
            />
            <FieldError>{errors.price?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.image} className="sm:col-span-2">
            <FieldLabel htmlFor="image">รูปภาพ</FieldLabel>
            <Input id="image" placeholder="/images/cars/example.jpg" aria-invalid={!!errors.image} {...form.register('image')} />
            <FieldDescription>พาธใน public/images/cars หรือ URL รูปภาพ</FieldDescription>
            <FieldError>{errors.image?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.officialUrl} className="sm:col-span-2">
            <FieldLabel htmlFor="officialUrl">เว็บไซต์ทางการ</FieldLabel>
            <Input
              id="officialUrl"
              type="url"
              placeholder="https://www.example.com"
              aria-invalid={!!errors.officialUrl}
              {...form.register('officialUrl')}
            />
            <FieldError>{errors.officialUrl?.message}</FieldError>
          </Field>
        </FormSection>

        <FormSection title="สมรรถนะและมอเตอร์" description="ข้อมูลขุมพลังและการขับเคลื่อน">
          <Field data-invalid={!!errors.spec?.powerKw}>
            <FieldLabel htmlFor="powerKw">กำลัง (kW)</FieldLabel>
            <Input
              id="powerKw"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              aria-invalid={!!errors.spec?.powerKw}
              {...form.register('spec.powerKw')}
            />
            <FieldError>{errors.spec?.powerKw?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.spec?.torque}>
            <FieldLabel htmlFor="torque">แรงบิด (Nm)</FieldLabel>
            <Input
              id="torque"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              aria-invalid={!!errors.spec?.torque}
              {...form.register('spec.torque')}
            />
            <FieldError>{errors.spec?.torque?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.spec?.topSpeed}>
            <FieldLabel htmlFor="topSpeed">ความเร็วสูงสุด (km/h)</FieldLabel>
            <Input
              id="topSpeed"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              aria-invalid={!!errors.spec?.topSpeed}
              {...form.register('spec.topSpeed')}
            />
            <FieldError>{errors.spec?.topSpeed?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.spec?.acceleration}>
            <FieldLabel htmlFor="acceleration">อัตราเร่ง 0-100 (วินาที)</FieldLabel>
            <Input
              id="acceleration"
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              aria-invalid={!!errors.spec?.acceleration}
              {...form.register('spec.acceleration')}
            />
            <FieldError>{errors.spec?.acceleration?.message}</FieldError>
          </Field>

          <SelectField
            control={form.control}
            name="spec.drivetrain"
            id="drivetrain"
            label="ระบบขับเคลื่อน"
            options={DRIVETRAIN_OPTIONS.map((option) => ({ value: option, label: option }))}
            error={errors.spec?.drivetrain?.message}
          />

          <SelectField
            control={form.control}
            name="spec.motorType"
            id="motorType"
            label="ประเภทมอเตอร์"
            options={MOTOR_TYPE_OPTIONS.map((option) => ({ value: option, label: option }))}
            error={errors.spec?.motorType?.message}
          />

          <Field data-invalid={!!errors.spec?.driveModes} className="sm:col-span-2">
            <FieldLabel htmlFor="driveModes">โหมดขับขี่</FieldLabel>
            <Input
              id="driveModes"
              placeholder="Eco, Normal, Sport"
              autoComplete="off"
              aria-invalid={!!errors.spec?.driveModes}
              {...form.register('spec.driveModes', { setValueAs: splitDriveModes })}
            />
            <FieldDescription>คั่นแต่ละโหมดด้วยเครื่องหมายจุลภาค ( , )</FieldDescription>
            <FieldError>{errors.spec?.driveModes?.message}</FieldError>
          </Field>
        </FormSection>

        <FormSection title="ขนาดและน้ำหนัก" description="มิติตัวถังและข้อมูลการใช้งาน">
          <Field data-invalid={!!errors.spec?.dimension?.length}>
            <FieldLabel htmlFor="length">ความยาว (mm)</FieldLabel>
            <Input
              id="length"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              aria-invalid={!!errors.spec?.dimension?.length}
              {...form.register('spec.dimension.length')}
            />
            <FieldError>{errors.spec?.dimension?.length?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.spec?.dimension?.width}>
            <FieldLabel htmlFor="width">ความกว้าง (mm)</FieldLabel>
            <Input
              id="width"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              aria-invalid={!!errors.spec?.dimension?.width}
              {...form.register('spec.dimension.width')}
            />
            <FieldError>{errors.spec?.dimension?.width?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.spec?.dimension?.height}>
            <FieldLabel htmlFor="height">ความสูง (mm)</FieldLabel>
            <Input
              id="height"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              aria-invalid={!!errors.spec?.dimension?.height}
              {...form.register('spec.dimension.height')}
            />
            <FieldError>{errors.spec?.dimension?.height?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.spec?.dimension?.wheelbase}>
            <FieldLabel htmlFor="wheelbase">ระยะฐานล้อ (mm)</FieldLabel>
            <Input
              id="wheelbase"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              aria-invalid={!!errors.spec?.dimension?.wheelbase}
              {...form.register('spec.dimension.wheelbase')}
            />
            <FieldError>{errors.spec?.dimension?.wheelbase?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.spec?.groundClearance}>
            <FieldLabel htmlFor="groundClearance">ความสูงใต้ท้องรถ (mm)</FieldLabel>
            <Input
              id="groundClearance"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              aria-invalid={!!errors.spec?.groundClearance}
              {...form.register('spec.groundClearance')}
            />
            <FieldError>{errors.spec?.groundClearance?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.spec?.turningRadius}>
            <FieldLabel htmlFor="turningRadius">รัศมีหักเลี้ยว (m)</FieldLabel>
            <Input
              id="turningRadius"
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              aria-invalid={!!errors.spec?.turningRadius}
              {...form.register('spec.turningRadius')}
            />
            <FieldError>{errors.spec?.turningRadius?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.spec?.weight}>
            <FieldLabel htmlFor="weight">น้ำหนัก (kg)</FieldLabel>
            <Input
              id="weight"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              aria-invalid={!!errors.spec?.weight}
              {...form.register('spec.weight')}
            />
            <FieldError>{errors.spec?.weight?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.spec?.seats}>
            <FieldLabel htmlFor="seats">จำนวนที่นั่ง</FieldLabel>
            <Input
              id="seats"
              type="number"
              inputMode="numeric"
              step="1"
              min="1"
              aria-invalid={!!errors.spec?.seats}
              {...form.register('spec.seats')}
            />
            <FieldError>{errors.spec?.seats?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.spec?.trunkCapacity}>
            <FieldLabel htmlFor="trunkCapacity">ความจุท้ายรถ (L)</FieldLabel>
            <Input
              id="trunkCapacity"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              aria-invalid={!!errors.spec?.trunkCapacity}
              {...form.register('spec.trunkCapacity')}
            />
            <FieldError>{errors.spec?.trunkCapacity?.message}</FieldError>
          </Field>

          <Field data-invalid={!!errors.spec?.trunkCapacityMax}>
            <FieldLabel htmlFor="trunkCapacityMax">ความจุท้ายรถสูงสุด (L)</FieldLabel>
            <Input
              id="trunkCapacityMax"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              aria-invalid={!!errors.spec?.trunkCapacityMax}
              {...form.register('spec.trunkCapacityMax')}
            />
            <FieldError>{errors.spec?.trunkCapacityMax?.message}</FieldError>
          </Field>
        </FormSection>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button asChild variant="outline" className="cursor-pointer">
            <Link href="/">ยกเลิก</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                กำลังบันทึก...
              </>
            ) : (
              'บันทึกข้อมูลรถ'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
