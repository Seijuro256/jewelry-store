import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapping for the letter necklaces that need special handling
const letterNecklaceMapping: Record<string, string> = {
  'gold-initial-necklace-letter-a-m': 'products/gold-plated-initial-necklace-mn',
  'gold-initial-necklace-letter-a-n': 'products/gold-plated-initial-necklace-mn',
  'gold-initial-necklace-letter-a-r': 'products/gold-plated-initial-necklace-rs',
  'gold-initial-necklace-letter-a-s': 'products/gold-plated-initial-necklace-rs',
  'gold-initial-necklace-letter-a-a': 'products/gold-plated-initial-necklace-abcd',
  'gold-initial-necklace-letter-a-b': 'products/gold-plated-initial-necklace-abcd',
  'gold-initial-necklace-letter-a-c': 'products/gold-plated-initial-necklace-abcd',
  'gold-initial-necklace-letter-a-d': 'products/gold-plated-initial-necklace-abcd',
  'gold-initial-necklace-letter-a-f': 'products/gold-plated-initial-necklace-fgh',
  'gold-initial-necklace-letter-a-g': 'products/gold-plated-initial-necklace-fgh',
  'gold-initial-necklace-letter-a-h': 'products/gold-plated-initial-necklace-fgh',
  'gold-initial-necklace-letter-a-j': 'products/gold-plated-initial-necklace-jkl',
  'gold-initial-necklace-letter-a-k': 'products/gold-plated-initial-necklace-jkl',
  'gold-initial-necklace-letter-a-l': 'products/gold-plated-initial-necklace-jkl',
}

async function syncCloudinaryImages() {
  const products = await prisma.product.findMany()
  
  console.log(`Found ${products.length} products to update\n`)
  
  for (const product of products) {
    // Check if this product needs special letter necklace mapping
    const cloudinaryPublicId = letterNecklaceMapping[product.handle] 
      || `products/${product.handle}`  // Add products/ prefix for regular products
    
    await prisma.product.update({
      where: { id: product.id },
      data: { images: [cloudinaryPublicId] }
    })
    
    console.log(`✓ ${product.name}`)
    console.log(`  → images: ["${cloudinaryPublicId}"]\n`)
  }
  
  console.log(`\nSuccessfully synced all ${products.length} products with Cloudinary!`)
}

syncCloudinaryImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect())