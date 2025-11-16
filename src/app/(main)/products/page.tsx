import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'

async function getProducts(): Promise<Product[]> {
  const res = await fetch('http://localhost:3000/api/products', {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()

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