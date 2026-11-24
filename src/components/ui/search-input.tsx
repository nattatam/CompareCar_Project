'use client'

import { useId } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

type SearchInputProps = {
  /** Controlled value. Leave undefined to use the input as an uncontrolled field. */
  value?: string
  /** Initial value for the uncontrolled input. */
  defaultValue?: string
  /** Called with the new value on every change and when the field is cleared. */
  onValueChange?: (value: string) => void
  /** Ref to the underlying input element. */
  inputRef?: React.RefObject<HTMLInputElement | null>
  label?: string
  clearLabel?: string
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  defaultValue = '',
  onValueChange,
  inputRef,
  label = 'Search',
  clearLabel = 'Clear search',
  placeholder,
  className,
}: SearchInputProps) {
  const inputId = useId()
  const isControlled = value !== undefined

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onValueChange?.(event.target.value)
  }

  function handleClear() {
    if (!isControlled && inputRef?.current) {
      inputRef.current.value = ''
    }
    onValueChange?.('')
  }

  return (
    <div className={cn('relative w-full', className)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id={inputId}
        ref={inputRef}
        type="search"
        value={isControlled ? value : undefined}
        defaultValue={isControlled ? undefined : defaultValue}
        onChange={handleChange}
        placeholder={placeholder ?? label}
        className={cn(
          'h-9 peer pl-9 pr-9',
          '[&::-webkit-search-cancel-button]:appearance-none'
        )}
      />
      <button
        type="button"
        onClick={handleClear}
        aria-label={clearLabel}
        className="absolute right-1.5 top-1/2 hidden size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring peer-[:not(:placeholder-shown)]:flex"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
