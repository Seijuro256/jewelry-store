import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'

const prisma = new PrismaClient()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const letterGroups: { [key: string]: string[] } = {
  'abcd': ['a', 'b', 'c', 'd'],
  'fgh': ['f', 'g', 'h'],
  'jkl': ['j', 'k', 'l'],
  'mn': ['m', 'n'],
  'rs': ['r', 's'],
}

async function syncImages() {
  console.log('Fetching images from Cloudinary...\n')

  const result = await cloudinary.search
    .expression('resource_type:image AND folder:products')
    .max_results(100)
    .execute()

  console.log(`Found ${result.resources.length} images\n`)

  const products = await prisma.product.findMany()
  let updated = 0
  let notMatched = 0

  for (const image of result.resources) {
    const handle = image.public_id.split('/').pop() || ''
    const imageUrl = image.secure_url

    console.log(`📸 ${handle}`)

    // Check if this is an alphabet necklace group
    let isLetterGroup = false
    for (const [groupKey, letters] of Object.entries(letterGroups)) {
      if (handle.includes(`gold-plated-initial-necklace-${groupKey}`)) {
        console.log(`  📝 Letter group: ${groupKey.toUpperCase()}`)
        isLetterGroup = true

        // Update all products in this group
        for (const letter of letters) {
          const product = products.find(p => 
            p.handle === `gold-plated-initial-necklace-${letter}`
          )

          if (product) {
            await prisma.product.update({
              where: { id: product.id },
              data: { images: [imageUrl] }
            })
            console.log(`  ✅ ${product.name}`)
            updated++
          }
        }
        break
      }
    }

    // Regular product (not letter group)
    if (!isLetterGroup) {
      const product = products.find(p => p.handle === handle)

      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: { images: [imageUrl] }
        })
        console.log(`  ✅ ${product.name}`)
        updated++
      } else {
        console.log(`  ⚠️  No matching product`)
        notMatched++
      }
    }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`✅ Products updated: ${updated}`)
  console.log(`⚠️  Not matched: ${notMatched}`)
  console.log(`${'='.repeat(50)}`)
}

syncImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect())