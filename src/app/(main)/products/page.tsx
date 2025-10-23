import { products } from '@/lib/data'
import ProductCard from '@/components/ProductCard'

export default function ProductsPage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className="text-3xl font-bold mb-2">Our Collection</h1>
        <p className="text-gray-600">
          Browse our handcrafted jewelry pieces
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}