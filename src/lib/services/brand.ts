import { prisma } from '@/lib/prisma'
import { BrandInput } from '@/lib/schema'
import { randomUUID } from 'crypto'
import type { Prisma } from '@/generated/prisma/client'

export type BrandEntry = {
  id: string
  name: string
  model: string
  subModel: string
}

export async function getBrands(query?: string): Promise<BrandEntry[]> {
  const search = query?.trim()

  const where: Prisma.SubModelCarWhereInput | undefined = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { model: { name: { contains: search, mode: 'insensitive' } } },
          { model: { brandCar: { name: { contains: search, mode: 'insensitive' } } } },
        ],
      }
    : undefined

  const subModelData = await prisma.subModelCar.findMany({
    where,
    include: {
      model: {
        include: {
          brandCar: true,
        },
      },
    },
    orderBy: [
      {
        model: {
          brandCar: {
            name: 'asc',
          },
        },
      },
      { model: { name: 'asc' } },
    ],
  })

  const brandList = subModelData.map((data) => {
    return {
      id: data.model.brandCar.id,
      name: data.model.brandCar.name,
      model: data.model.name,
      subModel: data.name,
    }
  })

  return brandList
}

export async function createBrand(data: BrandInput) {
  const { name, model, subModel } = data
  const brand = await prisma.$transaction(async (tx) => {
    let brandData = await tx.brandCar.findFirst({ where: { name } })
    let modelCarData = await tx.modelCar.findFirst({ where: { name: model } })

    if (!brandData) {
      brandData = await tx.brandCar.create({
        data: {
          id: randomUUID(),
          name,
        },
      })
    }

    if (!modelCarData) {
      modelCarData = await tx.modelCar.create({
        data: {
          id: randomUUID(),
          name: model,
          brandId: brandData.id,
        },
      })
    }

    const subModelData = await tx.subModelCar.create({
      data: {
        id: randomUUID(),
        name: subModel,
        modelId: modelCarData.id,
      },
    })

    return brandData
  })

  return brand
}
