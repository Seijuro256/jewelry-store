export interface Product {
  id: string
  handle: string
  name: string
  description: string
  price: number
  category: string
  type: string | null
  images: string[]
  stock: number
  materials: string[]
  vendor: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
}