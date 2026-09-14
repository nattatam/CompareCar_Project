import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CompareValue } from '.'

describe('CompareValue', () => {
  it('renders a number value with unit', () => {
    render(<CompareValue value={150} unit="hp" />)
    expect(screen.getByText('150 hp')).toBeInTheDocument()
  })

  it('renders a decimal value with one decimal place', () => {
    render(<CompareValue value={6.2} unit="s" />)
    expect(screen.getByText('6.2 s')).toBeInTheDocument()
  })

  it('renders a string value', () => {
    render(<CompareValue value="AWD" />)
    expect(screen.getByText('AWD')).toBeInTheDocument()
  })

  it('renders a dash for null', () => {
    render(<CompareValue value={null} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders a dash for undefined', () => {
    render(<CompareValue value={undefined} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('applies bold text when isBest is true', () => {
    render(<CompareValue value={200} unit="hp" isBest />)
    const text = screen.getByText('200 hp')
    expect(text.className).toContain('font-bold')
  })

  it('does not apply bold text when isBest is false', () => {
    render(<CompareValue value={200} unit="hp" isBest={false} />)
    const text = screen.getByText('200 hp')
    expect(text.className).not.toContain('font-bold')
  })

  it('renders without unit when unit is not provided', () => {
    render(<CompareValue value={42} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})