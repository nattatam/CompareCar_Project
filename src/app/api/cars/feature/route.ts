import { withAuth } from '@/lib/auth/api-guard'
import { prisma } from '@/lib/prisma'
import { parseFeatureParam, parseFeature } from '@/lib/parse/feature'
import { Prisma } from '@/generated/prisma/client'
import { randomUUID } from 'crypto'
import { apiError, readJsonBody, serverError, validationError } from '@/lib/api/response'

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)

  const parsed = parseFeatureParam(Object.fromEntries(searchParams))
  if (!parsed.ok) return validationError(parsed.errors)

  const { category, q } = parsed.data

  try {
    const where: Prisma.FeatureWhereInput = {
      ...(category && { category }),
      ...(q && { name: { contains: q, mode: 'insensitive' } }),
    }

    const features = await prisma.feature.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })
    return Response.json(features, { status: 200 })
  } catch {
    return serverError('ไม่สามารถขอข้อมูลได้')
  }
}

export const POST = withAuth(async (req: Request) => {
  const body = await readJsonBody(req)
  if (!body.ok) return body.response

  const parsed = parseFeature(body.body)
  if (!parsed.ok) return validationError(parsed.errors)

  const { name, category } = parsed.data

  try {
    const hasFeature = await prisma.feature.findFirst({
      where: { name, category },
    })

    if (hasFeature) return apiError('already feature', 400)

    const feature = await prisma.feature.create({
      data: {
        id: randomUUID(),
        name,
        category,
      },
    })
    return Response.json(feature, { status: 201 })
  } catch {
    return serverError('ไม่สามารถบันทึกข้อมูล Feature ได้')
  }
})
