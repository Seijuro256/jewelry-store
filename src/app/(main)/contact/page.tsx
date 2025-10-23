export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      
      <div className="mb-8">
        <p className="text-lg text-gray-600">
          Have a question or want to place a custom order? We'd love to hear from you!
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <h2 className="font-semibold mb-2">Email</h2>
          <a href="mailto:info@jewelryshop.com" className="text-blue-600 hover:underline">
            info@jewelryshop.com
          </a>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Phone</h2>
          <a href="tel:+61234567890" className="text-blue-600 hover:underline">
            +61 2 3456 7890
          </a>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Hours</h2>
          <p className="text-gray-600">
            Monday - Friday: 9am - 5pm<br />
            Saturday: 10am - 4pm<br />
            Sunday: Closed
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="font-semibold mb-4">Send us a message</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="How can we help you?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}