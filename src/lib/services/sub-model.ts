import type { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

type SubModelFilters = {
  modelId?: string
  modelName?: string
  q?: string
}

export async function getSubModels(filters: SubModelFilters = {}) {
  const where: Prisma.SubModelCarWhereInput = {}

  const modelFilter: Prisma.ModelCarWhereInput = {}
  if (filters.modelId) modelFilter.id = filters.modelId
  if (filters.modelName) modelFilter.name = filters.modelName
  if (Object.keys(modelFilter).length > 0) where.model = modelFilter

  const search = filters.q?.trim()
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { model: { name: { contains: search, mode: 'insensitive' } } },
      { model: { brandCar: { name: { contains: search, mode: 'insensitive' } } } },
    ]
  }

  return prisma.subModelCar.findMany({
    where,
    select: {
      id: true,
      name: true,
      modelId: true,
      model: {
        select: {
          id: true,
          name: true,
          brandCar: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: [
      { model: { brandCar: { name: 'asc' } } },
      { model: { name: 'asc' } },
      { name: 'asc' },
    ],
  })
}
