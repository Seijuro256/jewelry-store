'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function Navigation() {
  const { totalItems } = useCart()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Yeah Noir Yeah
        </Link>
        <ul className="flex gap-6 items-center">
          <li><Link href="/" className="hover:text-gray-600">Home</Link></li>
          <li><Link href="/products" className="hover:text-gray-600">Products</Link></li>
          <li><Link href="/about" className="hover:text-gray-600">About</Link></li>
          <li><Link href="/contact" className="hover:text-gray-600">Contact</Link></li>
          <li>
            <Link href="/cart" className="hover:text-gray-600 relative">
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}