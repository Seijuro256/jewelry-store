// lib/cloudinary.ts

export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string | number
    format?: string
    crop?: string
  } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  
  if (!cloudName) {
    throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set')
  }
  
  // Build transformation string
  const transformations: string[] = []
  
  if (options.width) transformations.push(`w_${options.width}`)
  if (options.height) transformations.push(`h_${options.height}`)
  if (options.quality) transformations.push(`q_${options.quality}`)
  if (options.format) transformations.push(`f_${options.format}`)
  if (options.crop) transformations.push(`c_${options.crop}`)
  
  const transformString = transformations.length > 0 
    ? `/${transformations.join(',')}`
    : ''
  
  return `https://res.cloudinary.com/${cloudName}/image/upload${transformString}/${publicId}`
}

// Convenience function for product images with common defaults
export function getProductImageUrl(
  publicId: string,
  size: 'thumbnail' | 'card' | 'detail' | 'full' = 'card'
): string {
  const sizeMap = {
    thumbnail: { width: 150, height: 150, crop: 'fill' },
    card: { width: 400, height: 400, crop: 'fill' },
    detail: { width: 800, height: 800, crop: 'fill' },
    full: { width: 1200, quality: 'auto', format: 'auto' }
  }
  
  return getCloudinaryUrl(publicId, {
    ...sizeMap[size],
    quality: 'auto',
    format: 'auto'
  })
}