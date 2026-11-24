import { withAuth } from '@/lib/auth/api-guard'
import { prisma } from '@/lib/prisma'
import { parseCarInput } from '@/lib/parse/car'
import { getCars } from '@/lib/services/car'
import { getImageCreditMap } from '@/lib/services/image-credit'
import { toCarListDTO } from '@/lib/mappers/car'
import { apiError, readJsonBody, serverError, validationError } from '@/lib/api/response'

const carInclude = {
  brand: true,
  model: {
    select: {
      id: true,
      name: true,
    },
  },
  subModel: {
    select: {
      id: true,
      name: true,
    },
  },
  categoryCar: true,
  powerTrain: true,
  spec: {
    include: {
      battery: true,
      dimensionCar: true,
    },
    omit: {
      batteryId: true,
      rangeId: true,
      chargingId: true,
      dimensionId: true,
    },
  },
} as const

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit')) || 24))
  const q = searchParams.get('q') || undefined
  const brand = searchParams.get('brand') || undefined
  const category = searchParams.get('category') || undefined
  const powertrain = searchParams.get('powertrain') || undefined
  const subtype = searchParams.get('subtype') || undefined
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const cars = await getCars(page, limit, q, {
    brand,
    category,
    powertrain,
    subtype,
    minPrice: Number.isNaN(minPrice) ? undefined : minPrice,
    maxPrice: Number.isNaN(maxPrice) ? undefined : maxPrice,
  })
  const credits = await getImageCreditMap(cars.data.map((car) => car.image))
  return Response.json(toCarListDTO(cars, credits))
}

export const POST = withAuth(async (req: Request) => {
  const body = await readJsonBody(req)
  if (!body.ok) return body.response

  const parsed = parseCarInput(body.body)
  if (!parsed.ok) return validationError(parsed.errors)

  const { spec, ...carFields } = parsed.data
  const { dimension, battery, charging, range, ...specFields } = spec

  const [brand, model, subModel, powerTrain, categoryCar] = await Promise.all([
    prisma.brandCar.findUnique({ where: { id: carFields.brandId }, select: { id: true } }),
    prisma.modelCar.findUnique({ where: { id: carFields.modelId }, select: { id: true, brandId: true } }),
    prisma.subModelCar.findUnique({ where: { id: carFields.subModelId }, select: { id: true, modelId: true } }),
    prisma.powerTrain.findUnique({ where: { id: carFields.powerTrainId }, select: { id: true } }),
    prisma.categoryCar.findUnique({ where: { id: carFields.categoryCarId }, select: { id: true } }),
  ])

  const missing: Record<string, string> = {}
  if (!brand) missing.brandId = 'ไม่พบแบรนด์ที่เลือก'
  if (!model) missing.modelId = 'ไม่พบรุ่นที่เลือก'
  if (!subModel) missing.subModelId = 'ไม่พบรุ่นย่อยที่เลือก'
  if (!powerTrain) missing.powerTrainId = 'ไม่พบระบบส่งกำลังที่เลือก'
  if (!categoryCar) missing.categoryCarId = 'ไม่พบประเภทรถที่เลือก'
  if (brand && model && model.brandId !== brand.id) missing.modelId = 'รุ่นไม่ตรงกับแบรนด์ที่เลือก'
  if (model && subModel && subModel.modelId !== model.id) missing.subModelId = 'รุ่นย่อยไม่ตรงกับรุ่นที่เลือก'
  if (Object.keys(missing).length > 0 || !brand || !model || !subModel || !powerTrain || !categoryCar) {
    return apiError('Master data not found', 400, missing)
  }

  try {
    const car = await prisma.$transaction(async (tx) => {
      const dimensionCar = await tx.dimensionCar.create({ data: dimension })
      const batteryData = await tx.battery.create({ data: battery })
      const chargingData = await tx.charging.create({ data: charging })
      const rangeData = await tx.range.create({ data: range })
      const specCar = await tx.specCar.create({
        data: {
          ...specFields,
          dimensionId: dimensionCar.id,
          batteryId: batteryData.id,
          rangeId: rangeData.id,
          chargingId: chargingData.id,
        },
      })
      const carData = {
        name: carFields.name,
        brandId: brand.id,
        modelId: model.id,
        subModelId: subModel.id,
        year: carFields.year,
        price: carFields.price,
        image: carFields.image,
        officialUrl: carFields.officialUrl,
        powerTrainId: powerTrain.id,
        categoryCarId: categoryCar.id,
        specId: specCar.id,
      }

      return tx.car.create({
        data: carData,
        include: carInclude,
      })
    })

    return Response.json(car, { status: 201 })
  } catch (error) {
    console.error('Failed to create car', error)
    return serverError('ไม่สามารถบันทึกข้อมูลรถได้')
  }
})
