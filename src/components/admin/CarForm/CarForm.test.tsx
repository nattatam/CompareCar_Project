import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CarForm from './'

const meta = {
  brands: [{ id: 'b1', name: 'Hyundai' }],
  models: [{ id: 'm1', name: 'IONIQ 5', brandId: 'b1', subModels: [{ id: 's1', name: 'Long Range' }] }],
  categories: [{ id: 'c1', name: 'SUV' }],
  powertrains: [{ id: 'p1', type: 'EV', subType: 'BEV' }],
}

function mockFetch() {
  return vi.fn(async (input: RequestInfo | URL) => {
    if (String(input) === '/api/cars/meta') {
      return new Response(JSON.stringify(meta), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
    return new Response(JSON.stringify({ id: 'car-1' }), { status: 201, headers: { 'Content-Type': 'application/json' } })
  })
}

async function selectOption(
  user: ReturnType<typeof userEvent.setup>,
  label: string,
  optionName: string
) {
  await user.click(screen.getByLabelText(label))
  await user.click(await screen.findByRole('option', { name: optionName }))
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('ชื่อรถ'), 'IONIQ 5')
  await selectOption(user, 'แบรนด์', 'Hyundai')
  await selectOption(user, 'รุ่น', 'IONIQ 5')
  await selectOption(user, 'รุ่นย่อย', 'Long Range')
  await selectOption(user, 'ประเภทรถ', 'SUV')
  await selectOption(user, 'ระบบส่งกำลัง', 'EV · BEV')
  await user.type(screen.getByLabelText('ปี'), '2024')
  await user.type(screen.getByLabelText('ราคา (บาท)'), '1999000')
  await user.type(screen.getByLabelText('รูปภาพ'), '/x.jpg')
  await user.type(screen.getByLabelText('เว็บไซต์ทางการ'), 'https://a.com')
  await user.type(screen.getByLabelText('กำลัง (kW)'), '168')
  await user.type(screen.getByLabelText('แรงบิด (Nm)'), '350')
  await user.type(screen.getByLabelText('ความเร็วสูงสุด (km/h)'), '185')
  await user.type(screen.getByLabelText('โหมดขับขี่'), 'Eco, Sport')
  await user.type(screen.getByLabelText('ความยาว (mm)'), '4655')
  await user.type(screen.getByLabelText('ความกว้าง (mm)'), '1940')
  await user.type(screen.getByLabelText('ความสูง (mm)'), '1675')
  await user.type(screen.getByLabelText('ระยะฐานล้อ (mm)'), '3000')
  await user.type(screen.getByLabelText('ความสูงใต้ท้องรถ (mm)'), '160')
  await user.type(screen.getByLabelText('น้ำหนัก (kg)'), '1900')
  await user.type(screen.getByLabelText('จำนวนที่นั่ง'), '5')
  await user.type(screen.getByLabelText('ความจุท้ายรถ (L)'), '520')
  await user.type(screen.getByLabelText('ความจุท้ายรถสูงสุด (L)'), '1580')
}

describe('CarForm', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows zod field errors without calling the cars endpoint on empty submit', async () => {
    const user = userEvent.setup()
    render(<CarForm />)

    await user.click(screen.getByRole('button', { name: 'บันทึกข้อมูลรถ' }))

    expect(await screen.findByText('กรุณาระบุชื่อรถ')).toBeInTheDocument()
    expect(screen.getByText('กรุณาระบุแบรนด์')).toBeInTheDocument()
    expect(screen.getByText('ปีต้องเป็นตัวเลข')).toBeInTheDocument()
    expect(screen.getByText('กำลัง (kW)ต้องเป็นตัวเลข')).toBeInTheDocument()
    expect(screen.getByText('ความยาว (mm)ต้องเป็นตัวเลข')).toBeInTheDocument()

    const posts = vi.mocked(fetch).mock.calls.filter(([url]) => String(url) === '/api/cars')
    expect(posts).toHaveLength(0)
  })

  it('posts coerced values with driveModes split on valid submit', async () => {
    const user = userEvent.setup()
    render(<CarForm />)
    await waitFor(() => expect(screen.getByLabelText('แบรนด์')).toBeEnabled())
    await fillValidForm(user)

    await user.click(screen.getByRole('button', { name: 'บันทึกข้อมูลรถ' }))

    const post = vi.mocked(fetch).mock.calls.find(([url]) => String(url) === '/api/cars')
    expect(post).toBeDefined()
    const body = JSON.parse(String(post?.[1]?.body))
    expect(body.year).toBe(2024)
    expect(body.price).toBe(1999000)
    expect(body.spec.driveModes).toEqual(['Eco', 'Sport'])
    expect(body.spec.acceleration).toBe(0)
    expect(body.spec.turningRadius).toBe(0)
    expect(body.spec.dimension).toEqual({ length: 4655, width: 1940, height: 1675, wheelbase: 3000 })
    expect(await screen.findByText('บันทึกข้อมูลรถสำเร็จ')).toBeInTheDocument()
  })

  it('surfaces master data errors returned by the server on the matching fields', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        if (String(input) === '/api/cars/meta') {
          return new Response(JSON.stringify(meta), { status: 200, headers: { 'Content-Type': 'application/json' } })
        }
        return new Response(JSON.stringify({ message: 'Master data not found', errors: { brandId: 'ไม่พบแบรนด์ที่เลือก' } }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      })
    )

    const user = userEvent.setup()
    render(<CarForm />)
    await waitFor(() => expect(screen.getByLabelText('แบรนด์')).toBeEnabled())
    await fillValidForm(user)

    await user.click(screen.getByRole('button', { name: 'บันทึกข้อมูลรถ' }))

    expect(await screen.findByText('ไม่พบแบรนด์ที่เลือก')).toBeInTheDocument()
  })
})
