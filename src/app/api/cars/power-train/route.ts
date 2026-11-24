import { withAuth } from '@/lib/auth/api-guard'
import { parsePowerTrainParam, parsePowerTrain } from '@/lib/parse/powerTrain'
import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
import { apiError, readJsonBody, serverError, validationError } from '@/lib/api/response'

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)

  const parsed = parsePowerTrainParam(Object.fromEntries(searchParams))
  if (!parsed.ok) return validationError(parsed.errors)

  const { type, subType } = parsed.data

  try {
    const where: Prisma.PowerTrainWhereInput = {
      ...(type && { type }),
      ...(subType && { subType }),
    }

    const powerTrain = await prisma.powerTrain.findMany({ where })
    return Response.json(powerTrain, { status: 200 })
  } catch {
    return serverError('ไม่สามารถขอข้อมูลได้')
  }
}

export const POST = withAuth(async (req: Request) => {
  const body = await readJsonBody(req)
  if (!body.ok) return body.response

  const parsed = parsePowerTrain(body.body)
  if (!parsed.ok) return validationError(parsed.errors)

  const { type, subType } = parsed.data

  try {
    const hasPowerTrain = await prisma.powerTrain.findFirst({
      where: { type, subType },
    })

    if (hasPowerTrain) return apiError('already powerTrain', 400)

    const powerTrain = await prisma.powerTrain.create({
      data: {
        id: randomUUID(),
        type,
        subType,
      },
    })
    return Response.json(powerTrain, { status: 200 })
  } catch {
    return serverError('ไม่สามารถบันทึกข้อมูล PowerTrain ได้')
  }
})
