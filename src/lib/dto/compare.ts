export type CompareCarSpecDTO = {
  powerKw?: number
  torque?: number
  topSpeed?: number
  acceleration?: number
  seats?: number
  drivetrain?: string
  weight?: number
  groundClearance?: number
  trunkCapacity?: number
  trunkCapacityMax?: number
  battery?: {
    type: string
    capacity: number
  }
  range?: {
    wltp?: number
    nedc?: number
  }
}

export type CompareCarDTO = {
  id: string
  name: string
  brand: string
  model: string
  subModel: string | null
  year: number
  price: number
  image: string
  category: string
  powerTrain: {
    type: string
    subType: string
  }
  spec: CompareCarSpecDTO | null
}

export type CompareDTO = {
  data: CompareCarDTO[]
  missingIds: string[]
}
