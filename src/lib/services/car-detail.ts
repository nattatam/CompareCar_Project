import type { FeatureCategory } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import type { CarEntry } from '@/lib/services/car'

export type CarFeatureDetail = {
  feature: {
    id: string
    name: string
    category: FeatureCategory
  }
}

export type CarDetail = CarEntry & {
  carFeatures?: CarFeatureDetail[]
}

const carInclude = {
  brand: true,
  model: {
    select: {
      id: true,
      name: true,
    },
  },
  subModel: {
    select: {
      id: true,
      name: true,
    },
  },
  categoryCar: true,
  powerTrain: true,
  carFeatures: {
    select: {
      feature: {
        select: { id: true, name: true, category: true },
      },
    },
  },
  spec: {
    include: {
      battery: true,
      dimensionCar: true,
      range: true,
      charge: true,
    },
    omit: {
      batteryId: true,
      rangeId: true,
      chargingId: true,
      dimensionId: true,
    },
  },
} as const

export async function getCarById(id: string): Promise<CarDetail | null> {
  const car = await prisma.car.findUnique({
    where: { id },
    include: carInclude,
    omit: {
      brandId: true,
      modelId: true,
      subModelId: true,
      powerTrainId: true,
      categoryCarId: true,
      specId: true,
    },
  })

  return (car as CarDetail | null) ?? null
}

export async function getCarByName(name: string): Promise<CarDetail | null> {
  const car = await prisma.car.findFirst({
    where: { name },
    include: carInclude,
    omit: {
      brandId: true,
      modelId: true,
      subModelId: true,
      powerTrainId: true,
      categoryCarId: true,
      specId: true,
    },
  })

  return (car as CarDetail | null) ?? null
}
