import Link from 'next/link'
import { TriangleAlert } from 'lucide-react'

interface DisclaimerBoxProps {
  className?: string
}

export default function DisclaimerBox({ className = '' }: DisclaimerBoxProps) {
  return (
    <aside
      lang="th"
      className={`flex flex-col gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-start ${className}`}
    >
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
      <p className="flex-1">
        <strong className="font-semibold text-amber-950">หมายเหตุ:</strong> ข้อมูล สเปก ราคา และรูปภาพบน Compare Car
        ใช้เพื่อประกอบการเปรียบเทียบเท่านั้น อาจแตกต่างจากข้อมูลอย่างเป็นทางการและมีการเปลี่ยนแปลงได้
        โปรดตรวจสอบข้อมูลล่าสุดจากผู้ผลิตหรือผู้จำหน่ายก่อนตัดสินใจซื้อ
      </p>
      <Link href="/disclaimer" className="shrink-0 font-medium text-amber-800 underline-offset-4 hover:underline">
        อ่านรายละเอียด
      </Link>
    </aside>
  )
}
