import type { useTranslations } from 'next-intl'
import type { Car } from '@/lib/types'

type CarsTranslator = ReturnType<typeof useTranslations<'Cars'>>
type CarField = 'brand' | 'model' | 'sub_model'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .replace(/\+/g, '_plus')
    .replace(/[^\w_]/g, '')
}

function fallbackValue(value: string | null | undefined): string {
  if (value == null) return '-'
  const trimmed = value.trim()
  if (trimmed === '' || trimmed === 'UNKNOWN') return '-'
  return trimmed
}

export function translateCarField(
  value: string | null | undefined,
  field: CarField,
  tCars: CarsTranslator
): string {
  const fallback = fallbackValue(value)
  if (fallback === '-') return fallback

  const key = slugify(fallback)
  return tCars.has(`${field}.${key}`) ? tCars(`${field}.${key}`) : fallback
}

export function localizeCar(car: Car, tCars: CarsTranslator): Car {
  const subModel = car.subModel ? translateCarField(car.subModel, 'sub_model', tCars) : undefined

  return {
    ...car,
    brand: translateCarField(car.brand, 'brand', tCars),
    model: translateCarField(car.model, 'model', tCars),
    subModel: subModel && subModel !== '-' ? subModel : undefined,
  }
}

export type LocalizedCarName = {
  brand: string
  model: string
  subModel: string | null
}

export function getLocalizedCarName(
  car: { brand: string; model: string; subModel?: string | null },
  tCars: CarsTranslator
): LocalizedCarName {
  const model = translateCarField(car.model, 'model', tCars)
  const subModel = car.subModel ? translateCarField(car.subModel, 'sub_model', tCars) : null

  return {
    brand: translateCarField(car.brand, 'brand', tCars),
    model,
    subModel: subModel && subModel !== '-' ? subModel : null,
  }
}

export function getCarDisplayName(
  car: { brand: string; model: string; subModel?: string | null },
  tCars: CarsTranslator
) {
  try {
    const { model, subModel } = getLocalizedCarName(car, tCars)
    return subModel ? `${model} ${subModel}` : `${model}`
  } catch {
    const parts = [car.brand, car.model, car.subModel].filter(Boolean)
    return parts.join(' ')
  }
}

export function getCarAltText(car: { brand: string; model: string; subModel?: string | null }, tCars: CarsTranslator) {
  return getCarDisplayName(car, tCars)
}
