import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-red-600/30">

      {/* TOP FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 text-center sm:text-left">

        {/* BRAND */}
        <div className="sm:col-span-2 md:col-span-1">
          <h2 className="text-2xl font-extrabold mb-4">
            <span className="text-red-500">Steal</span>
            <span className="text-yellow-400">Deals</span>
          </h2>
          <p className="text-sm leading-relaxed mb-6">
            StealDeals is your one-stop destination for unbeatable prices,
            exclusive offers, and premium products.
          </p>

          <div className="flex justify-center sm:justify-start gap-4 text-xl">
            <a className="hover:text-red-500">🌐</a>
            <a className="hover:text-red-500">📘</a>
            <a className="hover:text-red-500">📸</a>
            <a className="hover:text-red-500">🐦</a>
          </div>
        </div>

        {/* COLLAPSIBLE SECTIONS (Mobile) */}
        {[
          {
            title: "Shop",
            links: ["All Products", "Trending Deals", "Flash Sales", "New Arrivals", "Best Sellers"],
          },
          {
            title: "Company",
            links: ["About Us", "Careers", "Press", "Affiliates", "Investor Relations"],
          },
          {
            title: "Support",
            links: ["Help Center", "FAQs", "Returns & Refunds", "Shipping Policy", "Order Tracking"],
          },
        ].map((section) => (
          <details
            key={section.title}
            className="group md:open"
          >
            <summary className="text-white font-semibold mb-3 cursor-pointer list-none flex justify-between items-center md:block">
              {section.title}
              <span className="md:hidden group-open:rotate-180 transition">⌄</span>
            </summary>
            <ul className="space-y-2 text-sm mt-2">
              {section.links.map((link) => (
                <li key={link}>
                  <Link to="#" className="hover:text-red-500">{link}</Link>
                </li>
              ))}
            </ul>
          </details>
        ))}

        {/* NEWSLETTER */}
        <div className="sm:col-span-2 md:col-span-1">
          <h3 className="text-white font-semibold mb-4">Subscribe</h3>
          <p className="text-sm mb-4">
            Get exclusive deals & updates straight to your inbox.
          </p>

          <div className="flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
            />
            <button className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none text-white font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* TRUST BADGES */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4 justify-center text-sm text-gray-500">
          <span>🔒 Secure Payments</span>
          <span>🚚 Fast Delivery</span>
          <span>💯 Genuine Products</span>
          <span>⭐ 4.8/5 Rating</span>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-gray-500 text-center md:text-left">

          <p>© {new Date().getFullYear()} StealDeals. All rights reserved.</p>

          <div className="flex flex-wrap gap-6 justify-center">
            <Link to="#" className="hover:text-red-500">Privacy Policy</Link>
            <Link to="#" className="hover:text-red-500">Terms</Link>
            <Link to="#" className="hover:text-red-500">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
