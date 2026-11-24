import type { FeatureCategory } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type CarFeatureItem = {
  id: string
  name: string
  category: FeatureCategory
}

export type CarFeaturesResult = {
  carId: string
  carName: string
  intelligentAssist: CarFeatureItem[]
  security: CarFeatureItem[]
}

type CarRef = {
  id: string
  name: string
}

type MutationFailure = { ok: false; reason: 'car' } | { ok: false; reason: 'feature'; missing: string[] }

export type CarFeatureMutationResult = { ok: true; carId: string; count: number } | MutationFailure

export type RemoveCarFeatureResult = 'ok' | 'car' | 'feature'

function carWhere(idOrName: string) {
  return UUID_PATTERN.test(idOrName) ? { id: idOrName } : { name: idOrName }
}

async function resolveCar(idOrName: string): Promise<CarRef | null> {
  return prisma.car.findFirst({
    where: carWhere(idOrName),
    select: { id: true, name: true },
  })
}

function normalizeIds(featureIds: string[]): string[] {
  return [...new Set(featureIds.map((id) => id.trim()).filter(Boolean))]
}

async function findMissingFeatureIds(featureIds: string[]): Promise<string[]> {
  const validIds = featureIds.filter((id) => UUID_PATTERN.test(id))
  const invalidIds = featureIds.filter((id) => !UUID_PATTERN.test(id))

  const found = validIds.length
    ? await prisma.feature.findMany({ where: { id: { in: validIds } }, select: { id: true } })
    : []

  const foundIds = new Set(found.map((feature) => feature.id))
  return [...invalidIds, ...validIds.filter((id) => !foundIds.has(id))]
}

export async function getCarFeatures(idOrName: string): Promise<CarFeaturesResult | null> {
  const car = await prisma.car.findFirst({
    where: carWhere(idOrName),
    select: {
      id: true,
      name: true,
      carFeatures: {
        select: {
          feature: {
            select: { id: true, name: true, category: true },
          },
        },
      },
    },
  })

  if (!car) return null

  const features = car.carFeatures
    .map((carFeature) => carFeature.feature)
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    carId: car.id,
    carName: car.name,
    intelligentAssist: features.filter((feature) => feature.category === 'INTELLIGENT_ASSIST'),
    security: features.filter((feature) => feature.category === 'SECURITY'),
  }
}

export async function setCarFeatures(idOrName: string, featureIds: string[]): Promise<CarFeatureMutationResult> {
  const car = await resolveCar(idOrName)
  if (!car) return { ok: false, reason: 'car' }

  const ids = normalizeIds(featureIds)
  const missing = await findMissingFeatureIds(ids)
  if (missing.length > 0) return { ok: false, reason: 'feature', missing }

  await prisma.$transaction(async (tx) => {
    await tx.carFeature.deleteMany({ where: { carId: car.id } })
    if (ids.length > 0) {
      await tx.carFeature.createMany({
        data: ids.map((featureId) => ({ carId: car.id, featureId })),
        skipDuplicates: true,
      })
    }
  })

  return { ok: true, carId: car.id, count: ids.length }
}

export async function addCarFeatures(idOrName: string, featureIds: string[]): Promise<CarFeatureMutationResult> {
  const car = await resolveCar(idOrName)
  if (!car) return { ok: false, reason: 'car' }

  const ids = normalizeIds(featureIds)
  const missing = await findMissingFeatureIds(ids)
  if (missing.length > 0) return { ok: false, reason: 'feature', missing }

  if (ids.length > 0) {
    await prisma.carFeature.createMany({
      data: ids.map((featureId) => ({ carId: car.id, featureId })),
      skipDuplicates: true,
    })
  }

  return { ok: true, carId: car.id, count: ids.length }
}

export async function removeCarFeature(idOrName: string, featureId: string): Promise<RemoveCarFeatureResult> {
  const car = await resolveCar(idOrName)
  if (!car) return 'car'
  if (!UUID_PATTERN.test(featureId)) return 'feature'

  const feature = await prisma.feature.findUnique({ where: { id: featureId }, select: { id: true } })
  if (!feature) return 'feature'

  await prisma.carFeature.deleteMany({ where: { carId: car.id, featureId } })
  return 'ok'
}
