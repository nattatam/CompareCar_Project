import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithIntl } from '@/test/renderWithIntl'
import CarCard from './'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('@/components/CarImage', () => ({
  default: ({ alt }: { alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} data-testid="car-image" />
  ),
}))

vi.mock('@/components/ImageCredit', () => ({
  default: () => null,
}))

vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const car = {
  id: 'test-ev',
  brand: 'Tesla',
  model: 'Model 3',
  subModel: 'Standard RWD',
  year: 2025,
  price: 1149000,
  image: '/images/cars/tesla-model-3-standard.jpg',
  category: 'Sedan' as const,
  powertrain: { type: 'EV' as const, subtype: 'BEV' as const },
  specs: {
    powerKw: 208,
    torque: 420,
    topSpeed: 201,
    acceleration: { zeroToHundred: 6.2 },
    battery: { type: 'Li-ion', capacity: 57.5 },
    range: { wltp: 534 },
    charging: { ac: 7.6, dc: 175, time: 30 },
    drivetrain: 'RWD' as const,
    motorType: 'PMSM',
    driveModes: ['CHILL', 'SPORT'],
    dimension: { length: 4720, width: 1933, height: 1441, wheelbase: 2875 },
    groundClearance: 138,
    turningRadius: 5.8,
    weight: 1703,
    seats: 5,
    trunkCapacity: 682,
    trunkCapacityMax: 1582,
  },
}

describe('CarCard', () => {
  it('renders brand, model, and price', () => {
    renderWithIntl(<CarCard car={car} selected={false} onToggle={() => {}} />)
    expect(screen.getByText('Tesla')).toBeInTheDocument()
    expect(screen.getByText('Model 3')).toBeInTheDocument()
    expect(screen.getByText('฿1,149,000')).toBeInTheDocument()
  })

  it('renders the powertrain badge', () => {
    renderWithIntl(<CarCard car={car} selected={false} onToggle={() => {}} />)
    expect(screen.getByText('EV')).toBeInTheDocument()
  })

  it('links to the car detail page', () => {
    renderWithIntl(<CarCard car={car} selected={false} onToggle={() => {}} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/car/test-ev')
  })

  it('shows the add to compare button when not selected', () => {
    renderWithIntl(<CarCard car={car} selected={false} onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: 'Add to compare' })).toBeInTheDocument()
  })

  it('shows the selected button when selected', () => {
    renderWithIntl(<CarCard car={car} selected onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: 'Selected for compare' })).toBeInTheDocument()
  })

  it('calls onToggle with the car id when clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    renderWithIntl(<CarCard car={car} selected={false} onToggle={onToggle} />)
    await user.click(screen.getByRole('button', { name: 'Add to compare' }))
    expect(onToggle).toHaveBeenCalledWith('test-ev')
  })

  it('renders key specs', () => {
    renderWithIntl(<CarCard car={car} selected={false} onToggle={() => {}} />)
    expect(screen.getByText('279 hp')).toBeInTheDocument()
    expect(screen.getByText('420 Nm')).toBeInTheDocument()
    expect(screen.getByText('6.2s')).toBeInTheDocument()
    expect(screen.getByText('534 km WLTP')).toBeInTheDocument()
  })

  it('renders the car image with descriptive alt text', () => {
    renderWithIntl(<CarCard car={car} selected={false} onToggle={() => {}} />)
    expect(screen.getByTestId('car-image')).toHaveAttribute('alt', 'Tesla Model 3')
  })

  it('renders both WLTP and NEDC when both are available, NEDC first', () => {
    const dualRangeCar = { ...car, specs: { ...car.specs, range: { wltp: 534, nedc: 480 } } }
    renderWithIntl(<CarCard car={dualRangeCar} selected={false} onToggle={() => {}} />)
    const nedc = screen.getByText('480 km NEDC')
    const wltp = screen.getByText('534 km WLTP')
    expect(nedc).toBeInTheDocument()
    expect(wltp).toBeInTheDocument()
    expect(nedc.compareDocumentPosition(wltp)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('renders NEDC only when WLTP is missing', () => {
    const nedcOnlyCar = { ...car, specs: { ...car.specs, range: { nedc: 410 } } }
    renderWithIntl(<CarCard car={nedcOnlyCar} selected={false} onToggle={() => {}} />)
    expect(screen.getByText('410 km NEDC')).toBeInTheDocument()
    expect(screen.queryByText(/WLTP/)).not.toBeInTheDocument()
  })
})