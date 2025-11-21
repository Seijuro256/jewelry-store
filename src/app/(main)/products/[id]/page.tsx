import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'
import AddToCartButton from '@/components/AddToCartButton'

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    return null
  }
  
  return res.json()
}

export default async function ProductDetailPage({ params }: { params: Promise<{id: string}> }) {

  const { id } = await params
  const product = await getProduct(id)

  if(!product) {
    notFound()
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600' }
    if (stock <= 2) return { text: `Only ${stock} left!`, color: 'text-orange-600' }
    return { text: 'In Stock', color: 'text-green-600' }
  }

  const stockStatus = getStockStatus(product.stock)

  return (
    <div>
      <Link href="/products" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {product.images.length > 0 && product.images[0] ? (
            <>
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Additional images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 2}`} // Naming Alt image to match updated index
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
            ) : (
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="mb-4">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
          </div>

          <div className="mb-6">
            <span className={`text-sm font-semibold ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>

           <div className="mb-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <div 
              className="text-gray-600 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {product.materials && product.materials.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Materials</h2>
              <div className="flex gap-2 flex-wrap">
                {product.materials.map((material, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <span className="text-sm text-gray-500">Category: {product.category}</span>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
}