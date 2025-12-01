'use client'

import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function CartPage() {
    const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart()
    const [isLoading, setIsLoading] = useState(false)

    const handleCheckout = async () => {
      setIsLoading(true)

      try {
        // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      // Redirect to Stripe Checkout using the URL
      window.location.href = data.url
      } catch (error) {
          console.error('Checkout error:', error)
          alert('Something went wrong. Please try again.')
      } finally {
          setIsLoading(false)
      }
    }

    if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">
          Add some beautiful jewelry pieces to get started!
        </p>
        <Link
          href="/products"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 inline-block"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const hasImage = item.product.images.length > 0 && item.product.images[0]

            return (
              <div
                key={item.product.id}
                className="border rounded-lg p-4 flex gap-4"
              >
                {/* Product Image */}
                <Link
                  href={`/products/${item.product.id}`}
                  className="flex-shrink-0"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded relative overflow-hidden">
                    {hasImage ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Details */}
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="font-semibold text-lg hover:text-gray-600"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-gray-600 text-sm mb-2">
                    {formatPrice(item.product.price)} each
                  </p>

                  {/* Stock warning */}
                  {item.quantity > item.product.stock && (
                    <p className="text-red-600 text-sm mb-2">
                      Only {item.product.stock} available in stock
                    </p>
                  )}

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="border px-3 py-1 rounded hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="border px-3 py-1 rounded hover:bg-gray-100"
                        disabled={item.quantity >= item.product.stock}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 mb-4">
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <Link
              href="/products"
              className="block text-center text-sm text-gray-600 hover:text-black"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}