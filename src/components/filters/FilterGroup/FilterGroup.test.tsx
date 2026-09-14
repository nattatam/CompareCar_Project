import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FilterGroup } from '.'

describe('FilterGroup', () => {
  it('renders its label', () => {
    render(<FilterGroup label="Brand">content</FilterGroup>)
    expect(screen.getByText('Brand')).toBeInTheDocument()
  })

  it('renders its children', () => {
    render(
      <FilterGroup label="Category">
        <span>Sedan</span>
        <span>SUV</span>
      </FilterGroup>
    )
    expect(screen.getByText('Sedan')).toBeInTheDocument()
    expect(screen.getByText('SUV')).toBeInTheDocument()
  })
})
