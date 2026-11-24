import type { Decimal } from '@/generated/prisma/internal/prismaNamespace'
import type { CarDetail } from '@/lib/services/car-detail'
import type { Car, CarSpecsEv, Powertrain, PowertrainType } from '@/lib/types'

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

export function toCarDetailView(dbCar: CarDetail, slug: string): Car {
  const spec = dbCar.spec
  const features = (dbCar.carFeatures ?? []).map((carFeature) => carFeature.feature)
  const intelligentAssist = features
    .filter((feature) => feature.category === 'INTELLIGENT_ASSIST')
    .map((feature) => feature.name)
    .sort((a, b) => a.localeCompare(b))
  const security = features
    .filter((feature) => feature.category === 'SECURITY')
    .map((feature) => feature.name)
    .sort((a, b) => a.localeCompare(b))
  const specs = spec
    ? {
        powerKw: toNumber(spec.powerKw) ?? 0,
        torque: toNumber(spec.torque) ?? 0,
        topSpeed: positiveNumber(spec.topSpeed),
        acceleration: positiveNumber(spec.acceleration),
        battery: {
          type: spec.battery.type,
          capacity: toNumber(spec.battery.capacity) ?? 0,
        },
        range: {
          wltp: positiveNumber(spec.range?.wltp),
          nedc: positiveNumber(spec.range?.nedc),
          epa: positiveNumber(spec.range?.epa),
          cltc: positiveNumber(spec.range?.cltc),
        },
        charging: {
          ac: positiveNumber(spec.charge?.ac),
          dc: positiveNumber(spec.charge?.dc),
          time: positiveNumber(spec.charge?.time),
        },
        drivetrain: spec.drivetrain,
        motorType: spec.motorType,
        driveModes: spec.driveModes.length > 0 ? spec.driveModes : undefined,
        dimension: {
          length: toNumber(spec.dimensionCar.length) ?? 0,
          width: toNumber(spec.dimensionCar.width) ?? 0,
          height: toNumber(spec.dimensionCar.height) ?? 0,
          wheelbase: toNumber(spec.dimensionCar.wheelbase) ?? 0,
        },
        groundClearance: toNumber(spec.groundClearance) ?? 0,
        weight: positiveNumber(spec.weight),
        turningRadius: positiveNumber(spec.turningRadius),
        trunkCapacity: positiveNumber(spec.trunkCapacity),
        trunkCapacityMax: positiveNumber(spec.trunkCapacityMax),
        seats: spec.seats,
      }
    : {}

  return {
    id: slug,
    brand: dbCar.brand.name,
    model: dbCar.model.name,
    subModel: dbCar.subModel?.name ?? undefined,
    year: dbCar.year,
    price: toNumber(dbCar.price) ?? 0,
    image: dbCar.image,
    officialUrl: dbCar.officialUrl || undefined,
    category: dbCar.categoryCar.name as Car['category'],
    powertrain: {
      type: dbCar.powerTrain.type as PowertrainType,
      subType: dbCar.powerTrain.subType as Powertrain['subType'],
    },
    specs: {
      ...specs,
      ...(intelligentAssist.length > 0 ? { intelligentAssist } : {}),
      ...(security.length > 0 ? { security } : {}),
    } as CarSpecsEv,
  }
}
