import { describe, expect, it } from 'vitest'
import type { Decimal } from '@/generated/prisma/internal/prismaNamespace'
import type { CarEntry } from '@/lib/services/car'
import { toCompareDTO } from '@/lib/mappers/compare'

function decimal(value: number): Decimal {
  return { toNumber: () => value } as unknown as Decimal
}

function makeCar(id: string, overrides: Partial<CarEntry> = {}): CarEntry {
  return {
    id,
    name: `car-${id}`,
    year: 2025,
    price: decimal(1_000_000),
    image: '/images/cars/test.jpg',
    officialUrl: 'https://example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    brand: { id: 'brand', name: 'Brand' },
    model: { id: 'model', name: 'Model' },
    subModel: { id: 'submodel', name: 'Variant' },
    categoryCar: { id: 'category', name: 'SUV' },
    powerTrain: { id: 'powertrain', type: 'EV', subType: 'BEV' },
    spec: {
      id: 'spec',
      powerKw: decimal(150),
      torque: decimal(310),
      topSpeed: decimal(180),
      acceleration: decimal(7.5),
      drivetrain: 'AWD',
      motorType: 'PMSM',
      driveModes: ['Eco'],
      groundClearance: decimal(180),
      weight: decimal(1900),
      turningRadius: decimal(5.6),
      trunkCapacity: decimal(450),
      trunkCapacityMax: decimal(1400),
      seats: 5,
      battery: { id: 'battery', type: 'NMC', capacity: decimal(75) },
      range: { id: 'range', nedc: decimal(500), wltp: decimal(460), epa: null, cltc: null },
      charge: null,
      dimensionCar: { id: 'dimension', length: 4500, width: 1850, height: 1650, wheelbase: 2700 },
    },
    ...overrides,
  } as CarEntry
}

describe('toCompareDTO', () => {
  it('maps car and spec fields to the compare DTO', () => {
    const car = makeCar('a')
    const result = toCompareDTO([car], ['a'])

    expect(result.missingIds).toEqual([])
    expect(result.data).toHaveLength(1)
    expect(result.data[0]).toMatchObject({
      id: 'a',
      name: 'car-a',
      brand: 'Brand',
      model: 'Model',
      subModel: 'Variant',
      price: 1_000_000,
      category: 'SUV',
      powerTrain: { type: 'EV', subType: 'BEV' },
      spec: {
        powerKw: 150,
        torque: 310,
        topSpeed: 180,
        acceleration: 7.5,
        seats: 5,
        drivetrain: 'AWD',
        weight: 1900,
        groundClearance: 180,
        trunkCapacity: 450,
        range: { wltp: 460, nedc: 500 },
      },
    })
  })

  it('preserves the order of the requested ids', () => {
    const result = toCompareDTO([makeCar('a'), makeCar('b')], ['b', 'a'])
    expect(result.data.map((car) => car.id)).toEqual(['b', 'a'])
  })

  it('reports ids that were not found', () => {
    const result = toCompareDTO([makeCar('a')], ['a', 'missing'])
    expect(result.data.map((car) => car.id)).toEqual(['a'])
    expect(result.missingIds).toEqual(['missing'])
  })
})
