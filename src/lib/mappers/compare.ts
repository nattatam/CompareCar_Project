import type { Decimal } from '@/generated/prisma/internal/prismaNamespace'
import type { CarEntry } from '@/lib/services/car'
import type { CompareCarDTO, CompareDTO, CompareCarSpecDTO } from '@/lib/dto/compare'

type DecimalLike = Decimal | number | null | undefined

function toNumber(value: DecimalLike): number | undefined {
  if (value == null) return undefined
  const parsed = typeof value === 'number' ? value : value.toNumber()
  return Number.isFinite(parsed) ? parsed : undefined
}

function positiveNumber(value: DecimalLike): number | undefined {
  const parsed = toNumber(value)
  return parsed !== undefined && parsed > 0 ? parsed : undefined
}

function toCompareSpec(car: CarEntry): CompareCarSpecDTO | null {
  const spec = car.spec
  if (!spec) return null

  const specDto: CompareCarSpecDTO = {
    torque: positiveNumber(spec.torque),
    topSpeed: positiveNumber(spec.topSpeed),
    acceleration: positiveNumber(spec.acceleration),
    seats: spec.seats,
    drivetrain: spec.drivetrain,
    weight: positiveNumber(spec.weight),
    groundClearance: positiveNumber(spec.groundClearance),
    trunkCapacity: positiveNumber(spec.trunkCapacity),
    trunkCapacityMax: positiveNumber(spec.trunkCapacityMax),
    battery: {
      type: spec.battery.type,
      capacity: toNumber(spec.battery.capacity) ?? 0,
    },
  }

  const powerKw = positiveNumber(spec.powerKw)
  if (powerKw !== undefined) specDto.powerKw = powerKw

  const range = {
    wltp: positiveNumber(spec.range?.wltp),
    nedc: positiveNumber(spec.range?.nedc),
  }
  if (range.wltp !== undefined || range.nedc !== undefined) {
    specDto.range = range
  }

  return specDto
}

function toCompareCarDTO(car: CarEntry): CompareCarDTO {
  return {
    id: car.id,
    name: car.name,
    brand: car.brand.name,
    model: car.model.name,
    subModel: car.subModel?.name ?? null,
    year: car.year,
    price: toNumber(car.price) ?? 0,
    image: car.image,
    category: car.categoryCar.name,
    powerTrain: {
      type: car.powerTrain.type,
      subType: car.powerTrain.subType,
    },
    spec: toCompareSpec(car),
  }
}

export function toCompareDTO(cars: CarEntry[], ids: string[]): CompareDTO {
  const byId = new Map(cars.map((car) => [car.id, car] as const))
  const data: CompareCarDTO[] = []
  const missingIds: string[] = []

  for (const id of ids) {
    const car = byId.get(id)
    if (car) data.push(toCompareCarDTO(car))
    else missingIds.push(id)
  }

  return { data, missingIds }
}
