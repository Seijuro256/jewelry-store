import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME)
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✓ Loaded' : '✗ Missing')
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Loaded' : '✗ Missing')
console.log('')

function normalizePublicId(publicId: string): string {
  // Remove folder prefix if exists
  const filename = publicId.split('/').pop() || ''
  
  // Remove Cloudinary suffix
  const withoutSuffix = filename.replace(/_[a-z0-9]{6}$/i, '')
  
  // Convert underscores to hyphens, lowercase
  return withoutSuffix.replace(/_/g, '-').toLowerCase()
}

async function renameImages() {
  const result = await cloudinary.search
    .expression('resource_type:image AND folder:products')
    .max_results(100)
    .execute()

  console.log(`Found ${result.resources.length} images to rename\n`)

  for (const image of result.resources) {
    const oldPublicId = image.public_id
    const filename = oldPublicId.split('/').pop() || ''
    const newFilename = normalizePublicId(filename)
    const newPublicId = `products/${newFilename}`

    if (oldPublicId === newPublicId) {
      console.log(`✓ Already correct: ${filename}`)
      continue
    }

    try {
      await cloudinary.uploader.rename(oldPublicId, newPublicId, {
        invalidate: true
      })
      console.log(`✅ Renamed: ${filename} → ${newFilename}`)
    } catch (error) {
      console.error(`❌ Failed to rename ${filename}:`, error)
    }
  }

  console.log('\n🎉 Renaming complete!')
}

renameImages()
  .catch(console.error)