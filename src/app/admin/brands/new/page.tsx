import Link from 'next/link'
import BrandNewForm from './BrandNewForm'

export default function NewBrandPage() {
  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Add New Brand</h1>
        <Link href="/admin/brands" className="text-sm text-muted-foreground hover:text-foreground">
          Back to Brands
        </Link>
      </div>

      <BrandNewForm />
    </div>
  )
}
