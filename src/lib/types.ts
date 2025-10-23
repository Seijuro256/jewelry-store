export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  stock: number
  materials?: string[]
  createdAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
}