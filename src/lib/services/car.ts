import type { Prisma } from '@/generated/prisma/client'
import { Decimal } from '@/generated/prisma/internal/prismaNamespace'
import type { BatteryType, Drivetrain, MotorType } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'

export type Brand = {
  id: string
  name: string
}

export type Model = {
  id: string
  name: string
}

export type SubModel = {
  id: string
  name: string
}

export type CategoryCar = {
  id: string
  name: string
}

export type PowerTrain = {
  id: string
  type: string
  subType: string
}

export type Battery = {
  id: string
  type: BatteryType
  capacity: Decimal
}

export type DimensionCar = {
  id: string
  length: number
  width: number
  height: number
  wheelbase: number
}

export type RangeCar = {
  id: string
  nedc: Decimal
  wltp: Decimal | null
  epa: Decimal | null
  cltc: Decimal | null
}

export type Charging = {
  id: string
  ac: Decimal
  dc: Decimal
  time: Decimal
}

export type SpecCar = {
  id: string
  powerKw: Decimal
  torque: Decimal
  topSpeed: Decimal
  acceleration: Decimal
  drivetrain: Drivetrain
  motorType: MotorType
  driveModes: string[]
  groundClearance: Decimal
  weight: Decimal
  turningRadius: Decimal
  trunkCapacity: Decimal
  trunkCapacityMax: Decimal
  seats: number
  battery: Battery
  range?: RangeCar | null
  charge?: Charging | null
  dimensionCar: DimensionCar
}

export type CarEntry = {
  id: string
  name: string
  year: number
  price: Decimal
  image: string
  officialUrl: string
  createdAt: Date
  updatedAt: Date
  brand: Brand
  model: Model
  subModel: SubModel | null
  categoryCar: CategoryCar
  powerTrain: PowerTrain
  spec: SpecCar | null
}

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type CarData = {
  data: CarEntry[]
  pagination: Pagination
}

type CarFilters = {
  query?: string
  brand?: string
  category?: string
  powertrain?: string
  subtype?: string
  minPrice?: number
  maxPrice?: number
}

function searchConditions(search: string): Prisma.CarWhereInput[] {
  const tokens = search
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)

  return tokens.map((token) => ({
    OR: [
      { name: { contains: token, mode: 'insensitive' as const } },
      { brand: { name: { contains: token, mode: 'insensitive' as const } } },
      { model: { name: { contains: token, mode: 'insensitive' as const } } },
      { subModel: { name: { contains: token, mode: 'insensitive' as const } } },
    ],
  }))
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
  spec: {
    include: {
      battery: true,
      dimensionCar: true,
      range: true,
    },
    omit: {
      batteryId: true,
      rangeId: true,
      chargingId: true,
      dimensionId: true,
    },
  },
} as const

const carOmit = {
  brandId: true,
  modelId: true,
  subModelId: true,
  powerTrainId: true,
  categoryCarId: true,
  specId: true,
} as const

export async function getCars(page = 1, limit = 24, query?: string, filters: CarFilters = {}): Promise<CarData> {
  const skip = (page - 1) * limit
  const search = query?.trim() || filters.query?.trim()

  const andConditions: Prisma.CarWhereInput[] = []

  if (search) {
    andConditions.push(...searchConditions(search))
  }

  if (filters.brand && filters.brand !== 'All') {
    andConditions.push({ brand: { name: { contains: filters.brand, mode: 'insensitive' } } })
  }

  if (filters.category && filters.category !== 'All') {
    andConditions.push({ categoryCar: { name: { contains: filters.category, mode: 'insensitive' } } })
  }

  if (filters.powertrain && filters.powertrain !== 'All') {
    andConditions.push({ powerTrain: { type: { contains: filters.powertrain, mode: 'insensitive' } } })
  }

  if (filters.subtype && filters.subtype !== 'All') {
    andConditions.push({ powerTrain: { subType: { contains: filters.subtype, mode: 'insensitive' } } })
  }

  if (typeof filters.minPrice === 'number') {
    andConditions.push({ price: { gte: filters.minPrice } })
  }

  if (typeof filters.maxPrice === 'number') {
    andConditions.push({ price: { lte: filters.maxPrice } })
  }

  const where = andConditions.length > 0 ? { AND: andConditions } : undefined

  const [carList, total] = await Promise.all([
    prisma.car.findMany({
      where,
      skip,
      take: limit,
      include: carInclude,
      omit: carOmit,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.car.count({ where }),
  ])

  return {
    data: carList,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getCarsByIds(ids: string[]): Promise<CarEntry[]> {
  if (ids.length === 0) return []

  const carList = await prisma.car.findMany({
    where: { id: { in: ids } },
    include: carInclude,
    omit: carOmit,
  })

  const byId = new Map(carList.map((car) => [car.id, car] as const))
  return ids.flatMap((id) => {
    const car = byId.get(id)
    return car ? [car] : []
  })
}
