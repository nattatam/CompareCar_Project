'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Car } from 'lucide-react'

interface CarImageProps {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

export default function CarImage({ src, alt, className = '', sizes = '100%', priority = false }: CarImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`flex items-center justify-center h-full bg-gradient-to-br from-blue-100 via-zinc-100 to-blue-50 text-zinc-400 ${className}`}>
        <Car className="h-16 w-16" aria-label={alt} />
      </div>
    )
  }

  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} onError={() => setFailed(true)} />
}
