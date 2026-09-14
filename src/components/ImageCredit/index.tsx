'use client'

import { Info } from 'lucide-react'
import { getImageCredit } from '@/data/credits'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface ImageCreditProps {
  image: string
  className?: string
}

export default function ImageCredit({ image, className = 'absolute right-3 top-3' }: ImageCreditProps) {
  const credit = getImageCredit(image)
  if (!credit) return null

  return (
    <div className={className}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`Photo by ${credit.author}, ${credit.license}`}
            className="grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-background/90 text-muted-foreground shadow-sm ring-1 ring-border transition hover:text-foreground"
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6} className="max-w-80">
          <div className="flex flex-col gap-1.5 py-1">
            <p className="font-medium text-background">
              Photo: <span className="not-italic">{credit.author}</span>
            </p>
            <p className="text-[11px] text-background/80">{credit.note ?? 'Image courtesy of the author.'}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              {credit.licenseUrl && (
                <a
                  href={credit.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap font-semibold text-background underline underline-offset-2 hover:text-background/80"
                >
                  {credit.license}
                </a>
              )}
              <a
                href={credit.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap font-semibold text-background underline underline-offset-2 hover:text-background/80"
              >
                View on Commons
              </a>
              {credit.videoUrl && (
                <a
                  href={credit.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap font-semibold text-background underline underline-offset-2 hover:text-background/80"
                >
                  Watch on YouTube
                </a>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
