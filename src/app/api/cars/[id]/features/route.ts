import { NextRequest } from 'next/server'
import { apiError, readJsonBody, serverError, validationError } from '@/lib/api/response'
import { withAuth } from '@/lib/auth/api-guard'
import { parseCarFeature } from '@/lib/parse/carFeature'
import {
  addCarFeatures,
  getCarFeatures,
  setCarFeatures,
  type CarFeatureMutationResult,
} from '@/lib/services/car-feature'

type Params = { params: Promise<{ id: string }> }

function mutationError(result: Extract<CarFeatureMutationResult, { ok: false }>) {
  if (result.reason === 'car') return apiError('Car not found', 404)

  return apiError('Feature not found', 400, { featureIds: result.missing })
}

async function mutationResponse(carId: string, count: number) {
  const features = await getCarFeatures(carId)
  return Response.json({ ...features, count }, { status: 200 })
}

export const GET = async (_req: NextRequest, { params }: Params) => {
  const { id } = await params

  try {
    const features = await getCarFeatures(id)
    if (!features) return apiError('Car not found', 404)
    return Response.json(features, { status: 200 })
  } catch {
    return serverError('ไม่สามารถขอข้อมูลได้')
  }
}

export const PUT = withAuth(async (req: NextRequest, { params }: Params) => {
  const { id } = await params

  const body = await readJsonBody(req)
  if (!body.ok) return body.response

  const parsed = parseCarFeature(body.body)
  if (!parsed.ok) return validationError(parsed.errors)

  try {
    const result = await setCarFeatures(id, parsed.data.featureIds)
    if (!result.ok) return mutationError(result)
    return mutationResponse(result.carId, result.count)
  } catch (error) {
    console.error('Failed to set car features', error)
    return serverError('ไม่สามารถบันทึกข้อมูลฟีเจอร์ของรถได้')
  }
})

export const POST = withAuth(async (req: NextRequest, { params }: Params) => {
  const { id } = await params

  const body = await readJsonBody(req)
  if (!body.ok) return body.response

  const parsed = parseCarFeature(body.body)
  if (!parsed.ok) return validationError(parsed.errors)

  try {
    const result = await addCarFeatures(id, parsed.data.featureIds)
    if (!result.ok) return mutationError(result)
    return mutationResponse(result.carId, result.count)
  } catch (error) {
    console.error('Failed to add car features', error)
    return serverError('ไม่สามารถบันทึกข้อมูลฟีเจอร์ของรถได้')
  }
})
