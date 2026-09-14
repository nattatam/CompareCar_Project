import fs from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { cars } from '@/data/cars'
import { IMAGE_CREDITS, getPublicDomainSource } from '@/data/credits'
import CarImage from '@/components/CarImage'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const metadata: Metadata = {
  title: 'Image Credits — CompareCar',
  description:
    'Attribution for vehicle images used on CompareCar. Photos are used under their original Wikimedia Commons / Creative Commons licenses.',
  alternates: {
    canonical: '/credits',
  },
}

function imageExists(imagePath: string): boolean {
  const name = imagePath.replace(/^\//, '')
  return fs.existsSync(path.join(process.cwd(), 'public', name))
}

export default function CreditsPage() {
  const images = Array.from(new Set(cars.map((c) => c.image))).sort()

  const rows = images.map((image) => {
    const credit = IMAGE_CREDITS[image]
    const pdSource = getPublicDomainSource(image)
    const carsUsing = cars.filter((c) => c.image === image)
    const exists = imageExists(image)
    return { image, credit, pdSource, carsUsing, exists }
  })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="size-4" />
        Back to catalog
      </Link>

      <div className="mt-4 mb-6">
        <h1 className="text-3xl font-bold text-foreground">Image Credits</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Vehicle photos used on CompareCar are licensed under Creative Commons and come from Wikimedia Commons. Each image below links to its source
          and license. Images marked CC0 are in the public domain and do not require attribution.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl bg-card shadow-sm ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="p-4 font-medium text-muted-foreground">Image</TableHead>
              <TableHead className="p-4 font-medium text-muted-foreground">Used by</TableHead>
              <TableHead className="p-4 font-medium text-muted-foreground">Photographer</TableHead>
              <TableHead className="p-4 font-medium text-muted-foreground">License</TableHead>
              <TableHead className="p-4 font-medium text-muted-foreground">Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ image, credit, pdSource, carsUsing, exists }) => (
              <TableRow key={image}>
                <TableCell className="p-4 align-top">
                  <div className="relative aspect-[16/9] w-32 overflow-hidden rounded-lg bg-muted">
                    <CarImage src={image} alt="" sizes="128px" />
                  </div>
                </TableCell>
                <TableCell className="p-4 align-top">
                  <ul className="space-y-0.5">
                    {carsUsing.map((c) => (
                      <li key={c.id}>
                        <Link href={`/car/${c.id}`} className="group text-sm font-medium text-foreground hover:text-primary">
                          {c.brand} {c.model}{' '}
                          {c.subModel && <span className="font-normal text-foreground/60 group-hover:text-primary">{c.subModel}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="p-4 align-top text-sm text-foreground/80">
                  {credit?.author ?? <span className="text-muted-foreground">{exists ? 'No attribution required' : '—'}</span>}
                </TableCell>
                <TableCell className="p-4 align-top text-sm">
                  {credit ? (
                    credit.licenseUrl ? (
                      <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                        {credit.license}
                      </a>
                    ) : (
                      <span className="font-medium text-foreground/80">{credit.license}</span>
                    )
                  ) : (
                    <span className="text-foreground/80 tabular-nums normal-case">
                      {exists ? (
                        <a
                          href="https://creativecommons.org/publicdomain/zero/1.0/deed.en"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          CC0
                        </a>
                      ) : (
                        'Placeholder'
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell className="p-4 align-top text-sm">
                  {credit ? (
                    <div className="space-y-1">
                      <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="block font-medium text-primary hover:underline">
                        View source
                      </a>
                      {credit.videoUrl && (
                        <a
                          href={credit.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block font-medium text-primary hover:underline"
                        >
                          Watch on YouTube
                        </a>
                      )}
                    </div>
                  ) : pdSource ? (
                    <a href={pdSource} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      View source
                    </a>
                  ) : (
                    <span className="text-muted-foreground">{exists ? '—' : 'No photo yet'}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
