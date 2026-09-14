import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureList } from '.'

describe('FeatureList', () => {
  it('renders each feature', () => {
    render(<FeatureList items={['Lane Assist', 'Adaptive Cruise']} />)
    expect(screen.getByText('Lane Assist')).toBeInTheDocument()
    expect(screen.getByText('Adaptive Cruise')).toBeInTheDocument()
  })

  it('renders no list items when items is empty', () => {
    const { container } = render(<FeatureList items={[]} />)
    expect(container.querySelectorAll('li')).toHaveLength(0)
  })
})