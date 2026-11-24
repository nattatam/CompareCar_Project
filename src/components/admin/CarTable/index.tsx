import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { CarListItemDTO } from '@/lib/dto/car'
import dayjs from 'dayjs'

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

type CarTableProps = {
  list: CarListItemDTO[]
  query?: string
  pagination?: Pagination
}

export default function CarTable({ list = [], query = '', pagination }: CarTableProps) {
  const noIndex = (index: number) => {
    const no = pagination ? (pagination.page - 1) * pagination.limit : 0
    return no + index + 1
  }
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead className="min-w-20 max-w-25">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>SubModel</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                {query ? `No brands match "${query}"` : 'No brands found'}
              </TableCell>
            </TableRow>
          ) : (
            list.map((car, index) => (
              <TableRow key={car.id}>
                <TableCell>{noIndex(index)}</TableCell>
                <TableCell className="min-w-20 max-w-25">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full truncate cursor-default">{car.id}</div>
                    </TooltipTrigger>
                    <TooltipContent>{car.id}</TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>{car.name}</TableCell>
                <TableCell>{car.brand}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.subModel}</TableCell>
                <TableCell>{car.category}</TableCell>
                <TableCell>
                  <div>type: {car.powerTrain.type}</div>
                  <div>subType: {car.powerTrain.subType}</div>
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
