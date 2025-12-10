import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugHandles() {
  const products = await prisma.product.findMany({
    select: { handle: true, name: true }
  })

  console.log('\nAll product handles in database:\n')
  products.forEach(p => {
    console.log(`${p.handle}`)
    console.log(`  → ${p.name}\n`)
  })
}

debugHandles()
  .finally(() => prisma.$disconnect())