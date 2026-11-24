import { describe, expect, it } from 'vitest'
import { parseCarInput } from '@/lib/parse/car'

const valid = {
  name: ' IONIQ 5 ',
  brandId: 'b1',
  modelId: 'm1',
  subModelId: 's1',
  powerTrainId: 'p1',
  categoryCarId: 'c1',
  year: '2024',
  price: '1999000',
  image: ' /x.jpg ',
  officialUrl: 'https://a.com',
  spec: {
    powerKw: '150',
    torque: '350',
    topSpeed: '180',
    acceleration: '',
    drivetrain: 'AWD',
    motorType: 'PMSM',
    driveModes: [' Eco ', '', 'Sport'],
    groundClearance: '160',
    turningRadius: '',
    weight: '1900',
    seats: '5',
    trunkCapacity: '520',
    trunkCapacityMax: '1580',
    dimension: { length: '4655', width: '1940', height: '1675', wheelbase: '3000' },
    battery: { type: 'LFP', capacity: '77.4' },
    charging: { ac: '11', dc: '240', time: '18' },
    range: { wltp: '500', nedc: '550' },
  },
}

describe('parseCarInput (zod)', () => {
  it('accepts valid payload with strings and trims', () => {
    const r = parseCarInput(valid)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.data.name).toBe('IONIQ 5')
      expect(r.data.image).toBe('/x.jpg')
      expect(r.data.year).toBe(2024)
      expect(r.data.price).toBe(1999000)
      expect(r.data.spec.driveModes).toEqual(['Eco', 'Sport'])
      expect(r.data.spec.acceleration).toBe(0)
      expect(r.data.spec.turningRadius).toBe(0)
      expect(r.data.spec.dimension.length).toBe(4655)
    }
  })

  it('rejects non object body', () => {
    const r = parseCarInput('nope')
    expect(r).toEqual({ ok: false, errors: { form: 'ข้อมูลที่ส่งมาไม่ถูกต้อง' } })
  })

  it('reports flat field keys for missing spec', () => {
    const r = parseCarInput({ ...valid, spec: undefined })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errors.powerKw).toBe('กำลัง (kW)ต้องเป็นตัวเลข')
      expect(r.errors.length).toBe('ความยาว (mm)ต้องเป็นตัวเลข')
      expect(r.errors.drivetrain).toBe('กรุณาเลือกระบบขับเคลื่อน')
      expect(Object.keys(r.errors)).toContain('seats')
      expect(Object.keys(r.errors)).toContain('wheelbase')
    }
  })

  it('reports empty strings and decimal errors', () => {
    const r = parseCarInput({ ...valid, name: '   ', year: 1800, spec: { ...valid.spec, seats: 0, torque: 10.123 } })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errors.name).toBe('กรุณาระบุชื่อรถ')
      expect(r.errors.year).toBe('ปีต้องไม่น้อยกว่า 1900')
      expect(r.errors.seats).toBe('จำนวนที่นั่งต้องไม่น้อยกว่า 1')
      expect(r.errors.torque).toBe('ทศนิยมได้ไม่เกิน 2 ตำแหน่ง')
    }
  })

  it('rejects bad enums and non array driveModes', () => {
    const r = parseCarInput({ ...valid, spec: { ...valid.spec, drivetrain: 'XWD', motorType: 'NOPE', driveModes: 'Eco' } })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errors.drivetrain).toBe('กรุณาเลือกระบบขับเคลื่อน')
      expect(r.errors.motorType).toBe('กรุณาเลือกประเภทมอเตอร์')
      expect(r.errors.driveModes).toBe('โหมดขับขี่ต้องเป็นรายการข้อความ')
    }
  })

  it('keeps acceleration optional', () => {
    const r = parseCarInput({ ...valid, spec: { ...valid.spec, acceleration: 7.5, driveModes: undefined } })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.data.spec.acceleration).toBe(7.5)
      expect(r.data.spec.driveModes).toEqual([])
    }
  })

  it('reports every required field for an empty submit', () => {
    const r = parseCarInput({
      name: '',
      brandId: '',
      modelId: '',
      subModelId: '',
      powerTrainId: '',
      categoryCarId: '',
      image: '',
      officialUrl: '',
      spec: { drivetrain: 'FWD', motorType: 'PMSM', driveModes: [] },
    })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errors).toMatchObject({
        name: 'กรุณาระบุชื่อรถ',
        brandId: 'กรุณาระบุแบรนด์',
        modelId: 'กรุณาระบุรุ่น',
        subModelId: 'กรุณาระบุรุ่นย่อย',
        powerTrainId: 'กรุณาระบุระบบส่งกำลัง',
        categoryCarId: 'กรุณาระบุประเภทรถ',
        image: 'กรุณาระบุรูปภาพ',
        officialUrl: 'กรุณาระบุลิงก์เว็บไซต์ทางการ',
        year: 'ปีต้องเป็นตัวเลข',
        price: 'ราคาต้องเป็นตัวเลข',
        powerKw: 'กำลัง (kW)ต้องเป็นตัวเลข',
        torque: 'แรงบิด (Nm)ต้องเป็นตัวเลข',
        topSpeed: 'ความเร็วสูงสุด (km/h)ต้องเป็นตัวเลข',
        seats: 'จำนวนที่นั่งต้องเป็นตัวเลข',
        length: 'ความยาว (mm)ต้องเป็นตัวเลข',
        width: 'ความกว้าง (mm)ต้องเป็นตัวเลข',
        height: 'ความสูง (mm)ต้องเป็นตัวเลข',
        wheelbase: 'ระยะฐานล้อ (mm)ต้องเป็นตัวเลข',
      })
      expect(r.errors.form).toBeUndefined()
    }
  })
})
