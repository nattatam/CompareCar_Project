import { withAuth } from '@/lib/auth/api-guard'
import { parseBrandInput } from '@/lib/parse/brand'
import { getBrands, createBrand } from '@/lib/services/brand'
import { readJsonBody, serverError, validationError } from '@/lib/api/response'

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const query = Object.fromEntries(searchParams.entries())

  const brands = await getBrands(query.q)
  return Response.json(brands)
}

export const POST = withAuth(async (req: Request) => {
  const body = await readJsonBody(req)
  if (!body.ok) return body.response

  const parsed = parseBrandInput(body.body)
  if (!parsed.ok) return validationError(parsed.errors)

  try {
    const brandData = await createBrand(parsed.data)
    return Response.json(brandData, { status: 201 })
  } catch (error) {
    console.error('Failed to create car', error)
    return serverError('ไม่สามารถบันทึกข้อมูลแบรนด์ได้')
  }
})
