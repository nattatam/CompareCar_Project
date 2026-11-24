import type { CarData, CarEntry } from '@/lib/services/car'
import type { CarListDTO, CarListItemDTO } from '@/lib/dto/car'
import type { ImageCredit } from '@/lib/types'

function toCarListItemDTO(car: CarEntry, credits: Record<string, ImageCredit>): CarListItemDTO {
  return {
    id: car.id,
    name: car.name,
    brand: car.brand.name,
    model: car.model.name,
    subModel: car.subModel?.name ?? null,
    year: car.year,
    price: car.price.toNumber(),
    image: car.image,
    officialUrl: car.officialUrl,
    category: car.categoryCar.name,
    credit: credits[car.image],
    powerTrain: {
      type: car.powerTrain.type,
      subType: car.powerTrain.subType,
    },
    spec: car.spec
      ? {
          powerKw: car.spec.powerKw ? car.spec.powerKw.toNumber() : undefined,
          torque: car.spec.torque ? car.spec.torque.toNumber() : undefined,
          topSpeed: car.spec.topSpeed ? car.spec.topSpeed.toNumber() : undefined,
          acceleration: car.spec.acceleration ? car.spec.acceleration.toNumber() : undefined,
          seats: car.spec.seats,
          drivetrain: car.spec.drivetrain,
          motorType: car.spec.motorType,
          battery: car.spec.battery
            ? {
                type: car.spec.battery.type,
                capacity: car.spec.battery.capacity.toNumber(),
              }
            : undefined,
          range: car.spec.range
            ? {
                nedc: car.spec.range.nedc ? car.spec.range.nedc.toNumber() : undefined,
                wltp: car.spec.range.wltp ? car.spec.range.wltp.toNumber() : undefined,
              }
            : undefined,
        }
      : null,
  }
}

export function toCarListDTO(cars: CarData, credits: Record<string, ImageCredit> = {}): CarListDTO {
  return {
    data: cars.data.map((car) => toCarListItemDTO(car, credits)),
    pagination: cars.pagination,
  }
}
