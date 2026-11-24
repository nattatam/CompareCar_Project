import type { ImageCredit } from '@/lib/types'

export type CarListItemDTO = {
  id: string
  name: string
  brand: string
  model: string
  subModel: string | null
  year: number
  price: number
  image: string
  officialUrl: string
  category: string
  credit?: ImageCredit
  powerTrain: {
    type: string
    subType: string
  }
  spec: {
    powerKw?: number
    torque?: number
    topSpeed?: number
    acceleration?: number
    seats?: number
    drivetrain?: string
    motorType?: string
    battery?: {
      type: string
      capacity: number
    }
    range?: {
      nedc?: number
      wltp?: number
    }
  } | null
}

export type CarListDTO = {
  data: CarListItemDTO[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
