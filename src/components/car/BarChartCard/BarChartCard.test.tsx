import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import type { Car } from '@/lib/types'
import { renderWithIntl } from '@/test/renderWithIntl'
import { BarChartCard } from '.'

vi.mock('recharts', async () => {
  const MockContainer = ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>
  const Mock = () => <div data-testid="chart-element" />
  return {
    ResponsiveContainer: MockContainer,
    BarChart: Mock,
    Bar: Mock,
    XAxis: Mock,
    YAxis: Mock,
    CartesianGrid: Mock,
    Tooltip: Mock,
  }
})

describe('BarChartCard', () => {
  it('renders without crashing', () => {
    const car = {
      id: 'test',
      brand: 'Test',
      model: 'Model',
      year: 2025,
      price: 1000000,
      image: '/test.jpg',
      category: 'Sedan' as const,
      powertrain: { type: 'EV' as const },
      specs: {
        powerKw: 150,
        torque: 400,
        topSpeed: 240,
        acceleration: { zeroToHundred: 5 },
        seats: 5,
        drivetrain: 'AWD' as const,
        groundClearance: 140,
      },
    } as unknown as Car
    renderWithIntl(<BarChartCard car={car} />)
    expect(screen.getByTestId('chart-container')).toBeInTheDocument()
  })
})