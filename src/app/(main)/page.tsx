import Link from 'next/link'
import { products } from '@/lib/data'
import ProductCard from '@/components/ProductCard'

export default function HomePage() {
  const featuredProducts = products.slice(0, 3)

  return (
    <div>
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to JewelryShop</h1>
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