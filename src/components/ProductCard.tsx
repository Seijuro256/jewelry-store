import Link from 'next/link'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600' }
    if (stock <= 2) return { text: `Only ${stock} left!`, color: 'text-orange-600' }
    return { text: 'In Stock', color: 'text-green-600' }
  }

  const stockStatus = getStockStatus(product.stock)

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gray-200 relative">
          {/* Placeholder for now - we'll add real images later */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No Image
          </div>
          {product.stock === 0 && (
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            >
              <span className="text-white font-bold text-lg">SOLD OUT</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-gray-600">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            <span className={`text-sm font-semibold ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}