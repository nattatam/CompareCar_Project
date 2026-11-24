import { z } from 'zod'
import {
  DRIVETRAIN_OPTIONS,
  MOTOR_TYPE_OPTIONS,
  BATTERY_TYPE,
  FEATURE_CATEGORY_OPTIONS,
} from '@/constants/constants'

const MAX = 99_999_999_999_999.99

interface NumberRule {
  integer?: boolean
  min?: number
  max?: number
}

const decimal = (precision: number, scale: number, label?: string, fallback?: number) => {
  const factor = 10 ** scale
  const max = 10 ** (precision - scale) - 10 ** -scale
  const base = z
    .number({ error: `${label}ต้องเป็นตัวเลข` })
    .max(max)
    .refine((n) => Math.abs(n * factor - Math.round(n * factor)) < 1e-6, {
      message: `ทศนิยมได้ไม่เกิน ${scale} ตำแหน่ง`,
    })
  const field = fallback === undefined ? base : base.default(fallback)
  return z.preprocess(toNumberValue, field)
}

function requiredText(label: string) {
  return z
    .string({ error: `กรุณาระบุ${label}` })
    .trim()
    .min(1, `กรุณาระบุ${label}`)
}

function toNumberValue(value: unknown) {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  return trimmed === '' ? undefined : Number(trimmed)
}

function numberField(label: string, rule: NumberRule = {}) {
  let field = z.number({ error: `${label}ต้องเป็นตัวเลข` })
  if (rule.integer) field = field.int(`${label}ต้องเป็นจำนวนเต็ม`)
  if (rule.min !== undefined) field = field.min(rule.min, `${label}ต้องไม่น้อยกว่า ${rule.min}`)
  if (rule.max !== undefined) field = field.max(rule.max, `${label}ต้องไม่เกิน ${rule.max}`)
  return z.preprocess(toNumberValue, field)
}

function nested<T extends z.ZodType>(schema: T) {
  const preprocessed = z.preprocess((value) => (typeof value === 'object' && value !== null && !Array.isArray(value) ? value : {}), schema)
  return preprocessed as unknown as z.ZodType<z.output<T>, z.input<T>>
}

export const dimensionSchema = z.object({
  length: numberField('ความยาว (mm)', { integer: true, min: 0 }),
  width: numberField('ความกว้าง (mm)', { integer: true, min: 0 }),
  height: numberField('ความสูง (mm)', { integer: true, min: 0 }),
  wheelbase: numberField('ระยะฐานล้อ (mm)', { integer: true, min: 0 }),
})

export const batterySchema = z.object({
  type: z.enum(BATTERY_TYPE, { error: 'กรุณาเลือกประเภทแบตเตอร์รี่' }),
  capacity: decimal(16, 2).default(0),
})

export const rangeSchema = z.object({
  nedc: decimal(16, 2).default(0),
  wltp: decimal(16, 2).optional(),
  epa: decimal(16, 2).optional(),
  cltc: decimal(16, 2).optional(),
})

export const chargingSchema = z.object({
  ac: decimal(16, 2).optional(),
  dc: decimal(16, 2).optional(),
  time: decimal(16, 2).default(0),
})

export const specSchema = z.object({
  powerKw: decimal(16, 2, 'กำลัง (kW)'),
  torque: decimal(16, 2, 'แรงบิด (Nm)'),
  topSpeed: decimal(16, 2, 'ความเร็วสูงสุด (km/h)'),
  acceleration: decimal(16, 2, 'อัตราเร่ง (วินาที)', 0),
  drivetrain: z.enum(DRIVETRAIN_OPTIONS, { error: 'กรุณาเลือกระบบขับเคลื่อน' }),
  motorType: z.enum(MOTOR_TYPE_OPTIONS, { error: 'กรุณาเลือกประเภทมอเตอร์' }),
  driveModes: z
    .array(z.string(), { error: 'โหมดขับขี่ต้องเป็นรายการข้อความ' })
    .optional()
    .transform((modes) => (modes ?? []).map((mode) => mode.trim()).filter((mode) => mode !== '')),
  groundClearance: decimal(16, 2, 'ระยะต่ำสุดจากพื้น (mm)'),
  weight: decimal(16, 2, 'น้ำหนัก (kg)'),
  seats: numberField('จำนวนที่นั่ง', { integer: true, min: 1 }),
  trunkCapacity: decimal(16, 2, 'ความจุท้ายรถ (L)'),
  trunkCapacityMax: decimal(16, 2, 'ความจุท้ายรถสูงสุด (L)'),
  turningRadius: decimal(16, 2, 'วงเลี้ยว', 0),
  dimension: nested(dimensionSchema),
  battery: nested(batterySchema),
  charging: nested(chargingSchema),
  range: nested(rangeSchema),
})

export const carFormSchema = z.object(
  {
    name: requiredText('ชื่อรถ'),
    brandId: requiredText('แบรนด์'),
    modelId: requiredText('รุ่น'),
    subModelId: requiredText('รุ่นย่อย'),
    powerTrainId: requiredText('ระบบส่งกำลัง'),
    categoryCarId: requiredText('ประเภทรถ'),
    year: numberField('ปี', { integer: true, min: 1900, max: 2100 }),
    price: numberField('ราคา', { min: 0 }),
    image: requiredText('รูปภาพ'),
    officialUrl: requiredText('ลิงก์เว็บไซต์ทางการ'),
    spec: nested(specSchema),
  },
  { error: 'ข้อมูลที่ส่งมาไม่ถูกต้อง' }
)

export type CarDimensionInput = z.infer<typeof dimensionSchema>
export type CarSpecInput = z.infer<typeof specSchema>
export type CarInput = z.infer<typeof carFormSchema>
export type CarFormValues = z.input<typeof carFormSchema>

export const brandSchema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim(),
  model: z.string(),
  subModel: z.string(),
})

export type BrandInput = z.infer<typeof brandSchema>

export const categorySchema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim(),
})

export type CategoryInput = z.infer<typeof categorySchema>

export const modelParamSchema = z.object({
  brandId: z.string().trim().optional(),
  brandName: z.string().trim().optional(),
})

export const subModelParamSchema = z.object({
  modelId: z.string().trim().optional(),
  modelName: z.string().trim().optional(),
  q: z.string().trim().optional(),
})

export const powerTrainParamSchema = z.object({
  type: z.string().trim().optional(),
  subType: z.string().trim().optional(),
})

export const powerTrainSchema = z.object({
  type: z.string().trim(),
  subType: z.string().trim(),
})

export const featureParamSchema = z.object({
  category: z.enum(FEATURE_CATEGORY_OPTIONS).optional(),
  q: z.string().trim().optional(),
})

export const featureSchema = z.object({
  name: requiredText('ชื่อฟีเจอร์'),
  category: z.enum(FEATURE_CATEGORY_OPTIONS, { error: 'กรุณาเลือกหมวดหมู่ฟีเจอร์' }),
})

export type FeatureInput = z.infer<typeof featureSchema>

export const carFeatureInputSchema = z.object({
  featureIds: z.array(requiredText('featureId'), { error: 'featureIds ต้องเป็นรายการ' }),
})

export type CarFeatureInput = z.infer<typeof carFeatureInputSchema>
