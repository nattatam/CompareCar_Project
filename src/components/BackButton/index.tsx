'use client'

import { useRouter } from 'next/navigation'
import { scrollToTop } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { VariantProps } from 'class-variance-authority'
import { buttonVariants } from '@/components/ui/button'
import type { ReactNode } from 'react'

interface BackButtonProps {
  children: ReactNode
  fallbackHref?: string
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  className?: string
}

export default function BackButton({ children, fallbackHref = '/', variant = 'ghost', size = 'default', className }: BackButtonProps) {
  const router = useRouter()

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      scrollToTop()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <Button type="button" variant={variant} size={size} onClick={handleBack} className={className}>
      {children}
    </Button>
  )
}

