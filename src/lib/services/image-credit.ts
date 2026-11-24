import { prisma } from '@/lib/prisma'
import type { ImageCredit } from '@/lib/types'

export type ImageCreditCar = {
  id: string
  name: string
  brand: { name: string }
  model: { name: string }
  subModel: { name: string } | null
}

export type ImageCreditWithCars = {
  credit: ImageCredit
  cars: ImageCreditCar[]
}

export async function getImageCredits(): Promise<ImageCredit[]> {
  return prisma.imageCredit.findMany({ orderBy: { name: 'asc' } })
}

export async function getImageCreditByImage(image: string): Promise<ImageCredit | null> {
  return prisma.imageCredit.findUnique({ where: { image } })
}

export async function getImageCreditMap(images: string[]): Promise<Record<string, ImageCredit>> {
  if (images.length === 0) return {}

  const credits = await prisma.imageCredit.findMany({
    where: { image: { in: images } },
  })

  return Object.fromEntries(credits.map((credit) => [credit.image, credit]))
}

export async function getCreditsWithCars(): Promise<ImageCreditWithCars[]> {
  const credits = await getImageCredits()
  if (credits.length === 0) return []

  const cars = await prisma.car.findMany({
    where: { image: { in: credits.map((credit) => credit.image) } },
    select: {
      id: true,
      name: true,
      image: true,
      brand: { select: { name: true } },
      model: { select: { name: true } },
      subModel: { select: { name: true } },
    },
    orderBy: { name: 'asc' },
  })

  const carsByImage = new Map<string, typeof cars>()
  for (const car of cars) {
    const list = carsByImage.get(car.image) ?? []
    list.push(car)
    carsByImage.set(car.image, list)
  }

  return credits.map((credit) => ({
    credit,
    cars: carsByImage.get(credit.image) ?? [],
  }))
}
