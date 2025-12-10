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
  'Option1 Name': string
  'Option1 Value': string
  'Variant SKU': string
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

  // First pass: Build a map of handles to their base product info
  const baseProductInfo = new Map<string, ShopifyProduct>()
  
  for (const row of data) {
    if (!row.Handle) continue
    
    // Store the first complete row for each handle (has title, description, etc.)
    if (!baseProductInfo.has(row.Handle) && row.Title) {
      baseProductInfo.set(row.Handle, row)
    }
  }

  // Second pass: Group products by Handle + Variant
  const productMap = new Map<string, ShopifyProduct>()
  
  for (const row of data) {
    if (!row.Handle) continue
    
    // Get base product info
    const baseInfo = baseProductInfo.get(row.Handle)
    if (!baseInfo) continue
    
    // Merge base info with variant-specific info
    const mergedRow = {
      ...baseInfo,  // Get title, description from base
      ...row,       // Override with variant-specific data (price, stock, image)
      Title: baseInfo.Title,  // Ensure title is from base
      'Body (HTML)': baseInfo['Body (HTML)'],  // Ensure description is from base
    }
    
    // Create unique key: handle + variant value
    const variantKey = row['Option1 Value'] 
      ? `${row.Handle}-${row['Option1 Value']}`
      : row.Handle
    
    if (!productMap.has(variantKey)) {
      productMap.set(variantKey, mergedRow)
    }
  }

  console.log(`Found ${productMap.size} unique products (including variants) to import...`)

  // Import unique products
  let imported = 0
  let skipped = 0
  
  for (const [key, product] of productMap) {
    try {
      // Skip products with missing essential data
      if (!product.Title || product.Title.trim() === '') {
        console.log(`⚠️  Skipped: Missing title for ${product.Handle}`)
        skipped++
        continue
      }

      // Parse materials
      const materialsStr = product['Jewelry material (product.metafields.shopify.jewelry-material)'] || ''
      const materials = materialsStr
        .split(';')
        .map(m => m.trim())
        .filter(m => m.length > 0)

      // Collect all images for this specific variant
      const variantKey = product['Option1 Value']
        ? `${product.Handle}-${product['Option1 Value']}`
        : product.Handle
      
      const images = data
        .filter(row => {
          const rowKey = row['Option1 Value']
            ? `${row.Handle}-${row['Option1 Value']}`
            : row.Handle
          return rowKey === variantKey && row['Image Src']
        })
        .map(row => row['Image Src'])

      // Create product name with variant (skip "Default Title")
      let productName: string
      let productHandle: string

      if (product['Option1 Value'] && product['Option1 Value'] !== 'Default Title') {
        productName = `${product.Title} - ${product['Option1 Value']}`
        productHandle = `${product.Handle}-${product['Option1 Value'].toLowerCase().replace(/\s+/g, '-')}`
      } else {
        productName = product.Title
        productHandle = product.Handle
      }

      const description = product['Body (HTML)'] || ''

      const cleanDescription = description.includes('stylesheet-group') || 
                               description.includes('body{margin:0}') || 
                               description.startsWith('[')
        ? ''  // Replace with empty string if it's stylesheet junk
        : description

      await prisma.product.create({
        data: {
          handle: productHandle,
          name: productName,
          description: cleanDescription,
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
      console.log(`✅ Imported: ${productName}`)
    } catch (error) {
      console.error(`❌ Error importing ${product.Title}:`, error)
      skipped++
    }
  }

  console.log(`\n🎉 Successfully imported ${imported} products!`)
  if (skipped > 0) {
    console.log(`⚠️  Skipped ${skipped} products due to missing data`)
  }
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