'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/lib/types'

interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({children}: {children: ReactNode}) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
        try {
            setItems(JSON.parse(savedCart))
        } catch (error) {
            console.error('Failed to load cart:', error)
        }
        }
        setIsLoaded(true)
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
        localStorage.setItem('cart', JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = (product: Product, quantity: number = 1) => {
        setItems(currentItems => {
            // Check if item already exists in cart
            const existingItem = currentItems.find(item => item.product.id === product.id)

            if (existingItem) {
                // Update quantity of existing item
                return currentItems.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                )
            } else {
                // Add new item
                return [...currentItems, { product, quantity }]
            }
        })
    }

    const removeItem = (productId: string) => {
        setItems(currentItems => currentItems.filter(item => item.product.id !== productId))
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId)
            return
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.product.id === productId
                ? { ...item, quantity }
                : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}