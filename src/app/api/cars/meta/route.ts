import { prisma } from '@/lib/prisma'

export const GET = async () => {
  const [brands, models, categories, powertrains] = await Promise.all([
    prisma.brandCar.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.modelCar.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        brandId: true,
        subModels: {
          orderBy: { name: 'asc' },
          select: { id: true, name: true },
        },
      },
    }),
    prisma.categoryCar.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.powerTrain.findMany({
      orderBy: [{ type: 'asc' }, { subType: 'asc' }],
      select: { id: true, type: true, subType: true },
    }),
  ])

  return Response.json({ brands, models, categories, powertrains })
}
