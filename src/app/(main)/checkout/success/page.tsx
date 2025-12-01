'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()
  const [hasClearedCart, setHasClearedCart] = useState(false)

  useEffect(() => {
    // Clear cart on successful payment (only once)
    if (sessionId && !hasClearedCart) {
      clearCart()
      setHasClearedCart(true)
    }
  }, [sessionId, clearCart, hasClearedCart])

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600">
          Thank you for your order. We've received your payment.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="font-semibold mb-2">What happens next?</h2>
        <ul className="text-left space-y-2 text-gray-600">
          <li>✓ You'll receive an email confirmation shortly</li>
          <li>✓ We'll process your order within 1-2 business days</li>
          <li>✓ You'll get a shipping notification with tracking info</li>
        </ul>
      </div>

      {sessionId && (
        <div className="text-sm text-gray-500 mb-8">
          Order reference: {sessionId.slice(-12)}
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <Link
          href="/products"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}