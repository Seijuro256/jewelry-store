import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import Papa from 'papaparse'

const prisma = new PrismaClient()

interface ShopifyProduct {
  Handle: string
  Title: string
  'Body (HTML)': string
  'Variant Price': string
  'Variant Inventory Qty': string
  'Image Src': string
  'Jewelry material (product.metafields.shopify.jewelry-material)': string
  'Jewelry type (product.metafields.shopify.jewelry-type)': string
  'Product Category': string
  Status: string
  Vendor: string
}

async function importShopifyProducts(csvFilePath: string) {
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8')
  
  const { data } = Papa.parse<ShopifyProduct>(fileContent, {
    header: true,
    skipEmptyLines: true,
  })

  console.log(`Found ${data.length} rows in CSV...`)

  // Clear existing products
  await prisma.product.deleteMany()
  console.log('Cleared existing products')

  // Group products by handle (Shopify exports one row per variant/image)
  const productMap = new Map<string, ShopifyProduct>()
  
  for (const row of data) {
    if (row.Handle && !productMap.has(row.Handle)) {
      productMap.set(row.Handle, row)
    }
  }

  console.log(`Found ${productMap.size} unique products to import...`)

  // Import unique products
  let imported = 0
  for (const [handle, product] of productMap) {
    try {
      // Parse materials from semicolon-separated string
      const materialsStr = product['Jewelry material (product.metafields.shopify.jewelry-material)'] || ''
      const materials = materialsStr
        .split(';')
        .map(m => m.trim())
        .filter(m => m.length > 0)

      // Collect all image URLs for this product
      const images = data
        .filter(row => row.Handle === handle && row['Image Src'])
        .map(row => row['Image Src'])

      await prisma.product.create({
        data: {
          handle: product.Handle,
          name: product.Title,
          description: product['Body (HTML)'] || '',
          price: parseFloat(product['Variant Price']) || 0,
          category: product['Product Category'] || 'Jewelry',
          type: product['Jewelry type (product.metafields.shopify.jewelry-type)'] || '',
          images: images.length > 0 ? images : [''],
          stock: parseInt(product['Variant Inventory Qty']) || 0,
          materials: materials,
          vendor: product.Vendor || 'Yeah Noir Yeah',
          status: product.Status || 'active',
        },
      })

      imported++
      console.log(`✅ Imported: ${product.Title}`)
    } catch (error) {
      console.error(`❌ Error importing ${product.Title}:`, error)
    }
  }

  console.log(`\n🎉 Successfully imported ${imported} products!`)
}

async function main() {
  const csvPath = process.argv[2]
  
  if (!csvPath) {
    console.error('❌ Please provide the CSV file path')
    console.error('Usage: npx tsx prisma/import-shopify.ts path/to/products.csv')
    process.exit(1)
  }

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ File not found: ${csvPath}`)
    process.exit(1)
  }

  await importShopifyProducts(csvPath)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })