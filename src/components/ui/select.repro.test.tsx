import { describe, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useForm, Controller } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Values {
  brandId: string
}

function Harness({ delayedOptions }: { delayedOptions?: { value: string; label: string }[] }) {
  const form = useForm<Values>({ defaultValues: { brandId: '' } })
  const options = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
    ...(delayedOptions ?? []),
  ]
  return (
    <form>
      <Controller
        control={form.control}
        name="brandId"
        render={({ field }) => (
          <Select
            value={(field.value as string) ?? ''}
            items={options.map((option) => ({ value: option.value, label: option.label }))}
            onValueChange={(nextValue) => field.onChange(nextValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกแบรนด์" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </form>
  )
}

describe('select key warning repro with Controller', () => {
  it('renders, updates options, opens select', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { rerender } = render(<Harness />)
    rerender(<Harness delayedOptions={[{ value: 'c', label: 'Gamma' }]} />)
    await waitFor(() => screen.getByText('เลือกแบรนด์').click())
    await screen.findByText('Alpha')
    const calls = err.mock.calls
    err.mockRestore()
    // eslint-disable-next-line no-console
    console.log(`=== console.error calls: ${calls.length}`)
    calls.forEach((call, i) => {
      // eslint-disable-next-line no-console
      console.log(
        `--- [${i}] ${call.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' | ')}`
      )
    })
  })
})
