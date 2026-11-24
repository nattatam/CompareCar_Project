import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft } from 'lucide-react'
import { getCreditsWithCars } from '@/lib/services/image-credit'
import { getLocalizedCarName } from '@/lib/car-i18n'
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

export default async function CreditsPage() {
  const t = await getTranslations('Credits')
  const tCommon = await getTranslations('Common')
  const tCars = await getTranslations('Cars')

  const rows = await getCreditsWithCars()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
        <ArrowLeft className="size-4" />
        {tCommon('back')}
      </Link>

      <div className="mt-4 mb-6">
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">{t('description')}</p>
      </div>

      <div className="overflow-x-auto rounded-xl bg-card shadow-sm ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="p-4 font-medium text-muted-foreground">{t('image')}</TableHead>
              <TableHead className="p-4 font-medium text-muted-foreground">{t('car')}</TableHead>
              <TableHead className="p-4 font-medium text-muted-foreground">{t('usedBy')}</TableHead>
              <TableHead className="p-4 font-medium text-muted-foreground">{t('photographer')}</TableHead>
              <TableHead className="p-4 font-medium text-muted-foreground">{t('license')}</TableHead>
              <TableHead className="p-4 font-medium text-muted-foreground">{t('source')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ credit, cars }) => {
              const primaryCar = cars[0]
              const primaryName = primaryCar
                ? getLocalizedCarName(
                    { brand: primaryCar.brand.name, model: primaryCar.model.name, subModel: primaryCar.subModel?.name },
                    tCars
                  )
                : null

              return (
                <TableRow key={credit.image}>
                  <TableCell className="p-4 align-top">
                    <div className="relative aspect-[16/9] w-32 overflow-hidden rounded-lg bg-muted">
                      <CarImage src={credit.image} alt="" sizes="128px" />
                    </div>
                  </TableCell>
                  <TableCell className="p-4 align-top text-sm font-medium text-foreground">
                    {primaryName ? `${primaryName.brand} ${primaryName.model}` : credit.name}
                  </TableCell>
                  <TableCell className="p-4 align-top">
                    {cars.length > 0 ? (
                      <ul className="space-y-0.5">
                        {cars.map((car) => {
                          const name = getLocalizedCarName(
                            { brand: car.brand.name, model: car.model.name, subModel: car.subModel?.name },
                            tCars
                          )

                          return (
                            <li key={car.id}>
                              <Link
                                href={`/car/${car.name}`}
                                className="group text-sm font-medium text-foreground hover:text-primary"
                              >
                                {name.brand} {name.model}{' '}
                                {name.subModel && (
                                  <span className="font-normal text-foreground/60 group-hover:text-primary">{name.subModel}</span>
                                )}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="p-4 align-top text-sm text-foreground/80">
                    {credit.author ?? <span className="text-muted-foreground">{t('noAttribution')}</span>}
                  </TableCell>
                  <TableCell className="p-4 align-top text-sm">
                    {credit.licenseUrl ? (
                      <a
                        href={credit.licenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {credit.license}
                      </a>
                    ) : (
                      <span className="font-medium text-foreground/80">{credit.license}</span>
                    )}
                  </TableCell>
                  <TableCell className="p-4 align-top text-sm">
                    <div className="space-y-1">
                      <a
                        href={credit.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-medium text-primary hover:underline"
                      >
                        {t('viewSource')}
                      </a>
                      {credit.videoUrl && (
                        <a
                          href={credit.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block font-medium text-primary hover:underline"
                        >
                          {t('watchYouTube')}
                        </a>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
