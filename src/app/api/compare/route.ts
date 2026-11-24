import { getCarsByIds } from '@/lib/services/car'
import { toCompareDTO } from '@/lib/mappers/compare'
import { apiError, serverError } from '@/lib/api/response'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const MAX_COMPARE = 5

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const ids = Array.from(
    new Set(
      (searchParams.get('ids') ?? '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    )
  ).slice(0, MAX_COMPARE)

  if (ids.length === 0) {
    return apiError('ids query parameter is required', 400)
  }

  const validIds = ids.filter((id) => UUID_RE.test(id))

  try {
    const cars = validIds.length > 0 ? await getCarsByIds(validIds) : []
    return Response.json(toCompareDTO(cars, ids))
  } catch (error) {
    console.error('Failed to load cars for comparison', error)
    return serverError('Failed to load comparison')
  }
}
