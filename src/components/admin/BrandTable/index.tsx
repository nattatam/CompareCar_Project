import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { BrandEntry } from '@/lib/services/brand'

type BrandTableProps = {
  brands: BrandEntry[]
  query?: string
}

export default function BrandTable({ brands, query = '' }: BrandTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-20">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>SubModel</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                {query ? `No brands match "${query}"` : 'No brands found'}
              </TableCell>
            </TableRow>
          ) : (
            brands.map((brand, index) => (
              <TableRow key={index}>
                <TableCell className="min-w-20">{brand.id}</TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.model}</TableCell>
                <TableCell>{brand.subModel}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
