import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function listCloudinaryImages() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'products/',
      max_results: 100,
    })
    
    console.log('\nAll Cloudinary public_ids:\n')
    result.resources.forEach((resource: any) => {
      // Remove 'products/' prefix if it exists
      const publicId = resource.public_id.replace('products/', '')
      console.log(publicId)
    })
    
    console.log(`\nTotal images: ${result.resources.length}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

listCloudinaryImages()