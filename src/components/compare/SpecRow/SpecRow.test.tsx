import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SpecRow } from '.'

describe('SpecRow', () => {
  it('renders the label', () => {
    render(<SpecRow label="Power" value={150} unit="hp" />)
    expect(screen.getByText('Power')).toBeInTheDocument()
  })

  it('renders the value with unit', () => {
    render(<SpecRow label="Power" value={150} unit="hp" />)
    expect(screen.getByText('150 hp')).toBeInTheDocument()
  })

  it('renders a dash for null values', () => {
    render(<SpecRow label="Weight" value={null} unit="kg" />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })
})