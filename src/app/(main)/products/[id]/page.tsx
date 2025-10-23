import { products } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default function ProductDetailPage({ params }: { params: {id: string}}) {

  const product = products.find(p => p.id === params.id)

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
        {/* Product Image */}
        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
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
            <p className="text-gray-600">{product.description}</p>
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

          <button 
            disabled={product.stock === 0}
            className={`w-full py-3 px-6 rounded-lg font-semibold ${
              product.stock === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}