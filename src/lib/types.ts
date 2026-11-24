import { DRIVETRAIN_OPTIONS, MOTOR_TYPE_OPTIONS } from '@/constants/constants'

export type PowertrainType = 'ICE' | 'HEV' | 'EV'

export type HEvSubType = 'MHEV' | 'HEV' | 'PHEV' | 'REEV/EREV'
export type EvSubType = 'BEV'

export interface Powertrain {
  type: PowertrainType
  subType?: HEvSubType | EvSubType
}

export interface PowertrainResponse extends Powertrain {
  id: string
}

export type Category = 'Sedan' | 'SUV' | 'Sports' | 'Hatchback'

export type DrivetrainValue = (typeof DRIVETRAIN_OPTIONS)[number]

export type MotorTypeValue = (typeof MOTOR_TYPE_OPTIONS)[number]
export interface ImageCredit {
  id: string
  image: string
  name: string
  author: string | null
  sourceUrl: string
  license: string
  licenseUrl: string | null
  note: string | null
  videoUrl: string | null
}

export interface Battery {
  type: string
  capacity: number
}

export interface Dimension {
  length: number // mm
  width: number // mm
  height: number // mm
  wheelbase: number // mm
}

interface CarBase {
  id: string
  brand: string
  model: string
  subModel?: string
  year: number
  price: number
  image: string
  category: Category
  officialUrl?: string // official manufacturer website
}

export interface CarSpecs {
  torque: number // Nm
  topSpeed?: number // km/h
  acceleration?: number
  seats: number
  drivetrain: 'FWD' | 'RWD' | 'AWD' | '4WD'
  weight?: number // kg
  groundClearance: number // mm
  groundClearanceLoaded?: number // mm
  turningRadius?: number // m
  dimension: Dimension
  trunkCapacity?: number // L
  trunkCapacityMax?: number // L
  intelligentAssist?: string[] // ADAS / driver-assistance features
  security?: string[] // safety equipment
}

// ICE
export interface CarSpecsIce extends CarSpecs {
  horsepower: number // hp

  fuelEconomy?: number

  transmission: string
  engine: string
}

// EV
export interface CarSpecsEv extends CarSpecs {
  powerKw: number
  battery: Battery
  range: {
    wltp?: number
    nedc?: number
    epa?: number
    cltc?: number
  }
  charging: {
    ac?: number
    dc?: number
    time?: number
  }
  motorType: string
  driveModes?: string[]
  dimension: {
    length: number
    width: number
    height: number
    wheelbase: number
  }
  frunkCapacity?: number
  trunkCapacity?: number
  trunkCapacityMax?: number
}

export interface IceCar extends CarBase {
  powertrain: Powertrain
  specs: CarSpecsIce
}

export interface HevCar extends CarBase {
  powertrain: Powertrain
  specs: CarSpecsEv
}

export interface EvCar extends CarBase {
  powertrain: Powertrain
  specs: CarSpecsEv
}

export type Car = EvCar | HevCar | IceCar

export const POWERTRAIN_LABELS: Record<string, string> = {
  MHEV: 'MHEV',
  HEV: 'HEV',
  PHEV: 'PHEV',
  'REEV/EREV': 'REEV/EREV',
  BEV: 'EV',
  ICE: 'ICE',
}

export function badgeLabel(powertrain: Powertrain): string {
  if (powertrain.type === 'ICE') return 'ICE'
  if (powertrain.type === 'EV') return 'EV'
  return POWERTRAIN_LABELS[powertrain.subType ?? 'HEV']
}

export function formatPrice(price: number): string {
  return `฿${price.toLocaleString('en-US')}`
}
