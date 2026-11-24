import type { Metadata } from 'next'
import CarForm from '@/components/admin/CarForm'

export const metadata: Metadata = {
  title: 'เพิ่มข้อมูลรถ',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NewCarPage() {
  return <CarForm />
}
