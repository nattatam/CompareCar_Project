import type { Prisma } from '@/generated/prisma/client'
import { BrandInput } from './schema'

export const toBrandCreateData = (i: BrandInput): Prisma.BrandCarCreateInput => ({
  id: i.id,
  name: i.name,
})
