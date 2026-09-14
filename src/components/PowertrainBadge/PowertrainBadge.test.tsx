import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import PowertrainBadge from './'

describe('PowertrainBadge', () => {
  it('renders ICE for ICE powertrain', () => {
    render(<PowertrainBadge powertrain={{ type: 'ICE' }} />)
    expect(screen.getByText('ICE')).toBeInTheDocument()
  })

  it('renders EV for EV/BEV powertrain', () => {
    render(<PowertrainBadge powertrain={{ type: 'EV', subtype: 'BEV' }} />)
    expect(screen.getByText('EV')).toBeInTheDocument()
  })

  it('renders the subtype for HEV powertrains', () => {
    render(<PowertrainBadge powertrain={{ type: 'HEV', subtype: 'PHEV' }} />)
    expect(screen.getByText('PHEV')).toBeInTheDocument()
  })

  it('falls back to HEV when no subtype', () => {
    render(<PowertrainBadge powertrain={{ type: 'HEV' }} />)
    expect(screen.getByText('HEV')).toBeInTheDocument()
  })

  it('applies a custom className', () => {
    render(<PowertrainBadge powertrain={{ type: 'ICE' }} className="test-class" />)
    expect(screen.getByText('ICE').className).toContain('test-class')
  })
})