'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Product } from '@/lib/types'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [isAdded, setIsAdded] = useState(false)

    const handleAddToCart = () => {
        addItem(product, quantity)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000) // Reset after 2 seconds
  }

  if (product.stock === 0) {
    return (
      <button 
        disabled
        className="w-full py-3 px-6 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed"
      >
        Out of Stock
      </button>
    )
  }

  return (
    <div>
      {/* Quantity selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Quantity</label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            -
          </button>
          <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button 
        onClick={handleAddToCart}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          isAdded
            ? 'bg-green-600 text-white'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isAdded ? '✓ Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  )
}