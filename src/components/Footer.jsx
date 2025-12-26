import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-red-600/30">

      {/* TOP FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-extrabold mb-4">
            <span className="text-red-500">Steal</span>
            <span className="text-yellow-400">Deals</span>
          </h2>
          <p className="text-sm leading-relaxed mb-6">
            StealDeals is your one-stop destination for unbeatable prices,
            exclusive offers, and premium products.
          </p>

          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-red-500 transition">🌐</a>
            <a href="#" className="hover:text-red-500 transition">📘</a>
            <a href="#" className="hover:text-red-500 transition">📸</a>
            <a href="#" className="hover:text-red-500 transition">🐦</a>
          </div>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="text-white font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-red-500">All Products</Link></li>
            <li><Link to="#" className="hover:text-red-500">Trending Deals</Link></li>
            <li><Link to="#" className="hover:text-red-500">Flash Sales</Link></li>
            <li><Link to="#" className="hover:text-red-500">New Arrivals</Link></li>
            <li><Link to="#" className="hover:text-red-500">Best Sellers</Link></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-red-500">About Us</Link></li>
            <li><Link to="#" className="hover:text-red-500">Careers</Link></li>
            <li><Link to="#" className="hover:text-red-500">Press</Link></li>
            <li><Link to="#" className="hover:text-red-500">Affiliates</Link></li>
            <li><Link to="#" className="hover:text-red-500">Investor Relations</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-red-500">Help Center</Link></li>
            <li><Link to="#" className="hover:text-red-500">FAQs</Link></li>
            <li><Link to="#" className="hover:text-red-500">Returns & Refunds</Link></li>
            <li><Link to="#" className="hover:text-red-500">Shipping Policy</Link></li>
            <li><Link to="#" className="hover:text-red-500">Order Tracking</Link></li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-white font-semibold mb-4">Subscribe</h3>
          <p className="text-sm mb-4">
            Get exclusive deals & updates straight to your inbox.
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
            />
            <button className="bg-red-600 hover:bg-red-700 transition px-4 rounded-r-lg text-white font-semibold">
              →
            </button>
          </div>
        </div>
      </div>

      {/* TRUST BADGES */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-6 justify-center text-sm text-gray-500">
          <span>🔒 Secure Payments</span>
          <span>🚚 Fast Delivery</span>
          <span>💯 Genuine Products</span>
          <span>⭐ 4.8/5 Customer Rating</span>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">

          <p>© {new Date().getFullYear()} StealDeals. All rights reserved.</p>

          <div className="flex gap-6">
            <Link to="#" className="hover:text-red-500">Privacy Policy</Link>
            <Link to="#" className="hover:text-red-500">Terms of Service</Link>
            <Link to="#" className="hover:text-red-500">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
