import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/auth/api-guard'
import { getCarFeatures, removeCarFeature } from '@/lib/services/car-feature'
import { apiError, serverError } from '@/lib/api/response'

type Params = { params: Promise<{ id: string; featureId: string }> }

export const DELETE = withAuth(async (_req: NextRequest, { params }: Params) => {
  const { id, featureId } = await params

  try {
    const result = await removeCarFeature(id, featureId)

    if (result === 'car') return apiError('Car not found', 404)
    if (result === 'feature') return apiError('Feature not found', 404)

    const features = await getCarFeatures(id)
    return Response.json(features, { status: 200 })
  } catch (error) {
    console.error('Failed to remove car feature', error)
    return serverError('ไม่สามารถลบข้อมูลฟีเจอร์ของรถได้')
  }
})
