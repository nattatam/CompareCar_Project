import { prisma } from '@/lib/prisma'
import { paresModelParam } from '@/lib/parse/model'
import { Prisma } from '@/generated/prisma/client'
import { serverError, validationError } from '@/lib/api/response'

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const query = Object.fromEntries(searchParams.entries())

  const parsed = paresModelParam(query)
  if (!parsed.ok) return validationError(parsed.errors)

  const { brandId, brandName } = parsed.data || {}

  try {
    let where: Prisma.ModelCarWhereInput = {}
    if (brandId || brandName) {
      where = {
        OR: [{ brandId }, { brandCar: { name: brandName } }],
      }
    }
    const model = await prisma.modelCar.findMany({
      where,
      select: {
        id: true,
        name: true,
        brandCar: {
          select: { name: true },
        },
      },
    })
    return Response.json(model, { status: 200 })
  } catch {
    return serverError('ไม่สามารถขอข้อมูลได้')
  }
}
