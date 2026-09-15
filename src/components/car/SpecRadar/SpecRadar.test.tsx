import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import type { Car } from '@/lib/types'
import { renderWithIntl } from '@/test/renderWithIntl'
import { getValue, SpecRadar } from '.'

vi.mock('recharts', async () => {
  const MockContainer = ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>
  const Mock = () => <div data-testid="chart-element" />
  return {
    ResponsiveContainer: MockContainer,
    RadarChart: Mock,
    Radar: Mock,
    PolarGrid: Mock,
    PolarAngleAxis: Mock,
    PolarRadiusAxis: Mock,
  }
})

const ice = {
  id: 'test',
  brand: 'Test',
  model: 'Model',
  year: 2025,
  price: 1000000,
  image: '/test.jpg',
  category: 'SUV' as const,
  powertrain: { type: 'ICE' as const },
  specs: {
    horsepower: 250,
    powerKw: 100,
    torque: 400,
    topSpeed: 240,
    acceleration: { zeroToHundred: 5 },
    seats: 5,
    drivetrain: 'AWD' as const,
    groundClearance: 200,
  },
} as unknown as Car

describe('getValue', () => {
  it('uses horsepower for ICE cars', () => {
    expect(getValue(ice, 'power')).toBe(250)
  })

  it('converts kW to hp for cars without horsepower', () => {
    const ev = {
      ...ice,
      powertrain: { type: 'EV' },
      specs: { powerKw: 100, torque: 400, topSpeed: 240, acceleration: { zeroToHundred: 5 }, seats: 5, drivetrain: 'AWD', groundClearance: 200 },
    } as unknown as Car
    expect(getValue(ev, 'power')).toBe(134)
  })

  it('returns torque directly', () => {
    expect(getValue(ice, 'torque')).toBe(400)
  })

  it('returns top speed', () => {
    expect(getValue(ice, 'topSpeed')).toBe(240)
  })

  it('returns acceleration zeroToHundred', () => {
    const car = { ...ice, specs: { ...ice.specs, acceleration: { zeroToHundred: 5.5 } } } as unknown as Car
    expect(getValue(car, 'acceleration')).toBe(5.5)
  })

  it('returns 0 for missing top speed', () => {
    const car = { ...ice, specs: { ...ice.specs, topSpeed: undefined } } as unknown as Car
    expect(getValue(car, 'topSpeed')).toBe(0)
  })
})

describe('SpecRadar', () => {
  it('renders without crashing', () => {
    renderWithIntl(<SpecRadar car={ice} />)
    expect(screen.getByTestId('chart-container')).toBeInTheDocument()
  })
})