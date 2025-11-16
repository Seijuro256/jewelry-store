import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'

async function getProducts(): Promise<Product[]> {
  const res = await fetch('http://localhost:3000/api/products', {
    cache: 'no-store' // Always get fresh data
  })

  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }

  return res.json()
}

export default async function HomePage() {
  const products = await getProducts()
  const featuredProducts = products.slice(0, 3)

  return (
    <div>
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Yeah Noir Yeah!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover our collection of handcrafted jewelry
        </p>
        <Link 
          href="/products" 
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 inline-block"
        >
          Shop Now
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}