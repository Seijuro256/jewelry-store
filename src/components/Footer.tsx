import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t mt-auto bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Yeah Noir Yeah</h3>
            <p className="text-gray-600 text-sm">
              Beautiful handcrafted jewelry pieces for every occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-gray-600 hover:text-black">Products</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-black">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-black">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: yeahnoiryeah@gmail.com</li>
              <li>Phone: +61 2 3456 7890</li>
              <li>Location: Melbourne, VIC</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-gray-600 text-sm">
          <p>&copy; 2025 Yeah Noir Yeah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}