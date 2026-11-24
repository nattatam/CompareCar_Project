import { parseSubModelParam } from '@/lib/parse/subModel'
import { getSubModels } from '@/lib/services/sub-model'
import { serverError, validationError } from '@/lib/api/response'

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const parsed = parseSubModelParam(Object.fromEntries(searchParams.entries()))

  if (!parsed.ok) return validationError(parsed.errors)

  try {
    const subModels = await getSubModels(parsed.data)
    return Response.json(subModels, { status: 200 })
  } catch {
    return serverError('ไม่สามารถขอข้อมูลได้')
  }
}
