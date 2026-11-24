import { withAuth } from '@/lib/auth/api-guard'
import { prisma } from '@/lib/prisma'
import { parseCategoryInput } from '@/lib/parse/category'
import { randomUUID } from 'crypto'
import { apiError, readJsonBody, serverError, validationError } from '@/lib/api/response'

export const GET = async () => {
  const category = await prisma.categoryCar.findMany({})
  return Response.json(category)
}
export const POST = withAuth(async (req: Request) => {
  const body = await readJsonBody(req)
  if (!body.ok) return body.response

  const parsed = parseCategoryInput(body.body)
  if (!parsed.ok) return validationError(parsed.errors)

  const { name } = parsed.data

  try {
    const hasCategory = await prisma.categoryCar.findFirst({ where: { name } })

    if (hasCategory) return apiError('already category', 400)

    const category = await prisma.categoryCar.create({
      data: {
        id: randomUUID(),
        name,
      },
    })
    return Response.json(JSON.stringify(category), { status: 200 })
  } catch (error) {
    console.error('Failed to create car', error)
    return serverError('ไม่สามารถบันทึกข้อมูลแบรนด์ได้')
  }
})
