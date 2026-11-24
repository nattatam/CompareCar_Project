import { NextRequest } from 'next/server'
import { getCarByName } from '@/lib/services/car-detail'
import type { CarDetail } from '@/lib/services/car-detail'
import { apiError } from '@/lib/api/response'

function toCarFeature(car: CarDetail) {
  const features = car.carFeatures?.map((carFeature) => carFeature.feature) ?? []

  const pick = (category: 'INTELLIGENT_ASSIST' | 'SECURITY') =>
    features
      .filter((feature) => feature.category === category)
      .map((feature) => feature.name)
      .sort((a, b) => a.localeCompare(b))

  return {
    intelligent_assist: pick('INTELLIGENT_ASSIST'),
    security: pick('SECURITY'),
  }
}

export const GET = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const car = await getCarByName(id)

  if (!car) {
    return apiError('Car not found', 404)
  }

  const carData = { ...car }
  delete carData.carFeatures

  return Response.json({ ...carData, carFeature: toCarFeature(car) })
}
