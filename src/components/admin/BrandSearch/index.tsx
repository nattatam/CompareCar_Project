'use client'

import { useEffect, useRef, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { SearchInput } from '@/components/ui/search-input'

const DEBOUNCE_MS = 300

type BrandSearchProps = {
  /** Current query, read from the URL by the server component. */
  query: string
  /** Search param name used in the URL. */
  param?: string
  label?: string
  placeholder?: string
}

export default function BrandSearch({
  query,
  param = 'q',
  label = 'Search brands',
  placeholder = 'Search brand, model or sub-model',
}: BrandSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const submittedRef = useRef<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Keep the field in sync when the URL changes outside of the search box (back/forward)
  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    if (submittedRef.current === query) return
    if (input.value !== query) input.value = query
  }, [query])

  function search(next: string) {
    const trimmed = next.trim()
    submittedRef.current = trimmed

    const params = new URLSearchParams()
    if (trimmed) params.set(param, trimmed)

    const searchParams = params.toString()
    startTransition(() => {
      router.replace(searchParams ? `${pathname}?${searchParams}` : pathname, { scroll: false })
    })
  }

  function scheduleSearch(next: string) {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(next), DEBOUNCE_MS)
  }

  return (
    <div className="flex items-center gap-2">
      <SearchInput
        inputRef={inputRef}
        defaultValue={query}
        onValueChange={scheduleSearch}
        label={label}
        placeholder={placeholder}
        className="w-full sm:w-72"
      />
      {isPending && (
        <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden="true" />
      )}
    </div>
  )
}
