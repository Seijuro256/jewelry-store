import { Product } from './types'

export const products: Product[] = [
  {
    id: '1',
    name: 'Sterling Silver Necklace',
    description: 'Elegant handcrafted sterling silver necklace with delicate chain.',
    price: 89.99,
    category: 'Necklaces',
    images: ['/images/products/necklace-1.jpg'],
    stock: 3,  // Only 3 available
    materials: ['Sterling Silver'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Rose Gold Earrings',
    description: 'Beautiful rose gold drop earrings perfect for any occasion.',
    price: 64.99,
    category: 'Earrings',
    images: ['/images/products/earrings-1.jpg'],
    stock: 5,
    materials: ['Rose Gold', '14K Gold'],
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Diamond Ring',
    description: 'Stunning diamond engagement ring with brilliant cut stone.',
    price: 1299.99,
    category: 'Rings',
    images: ['/images/products/ring-1.jpg'],
    stock: 0,  // Out of stock
    materials: ['Platinum', 'Diamond'],
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    name: 'Pearl Bracelet',
    description: 'Classic freshwater pearl bracelet with gold clasp.',
    price: 124.99,
    category: 'Bracelets',
    images: ['/images/products/bracelet-1.jpg'],
    stock: 2,
    materials: ['Freshwater Pearls', '18K Gold'],
    createdAt: new Date('2024-02-10')
  }
]