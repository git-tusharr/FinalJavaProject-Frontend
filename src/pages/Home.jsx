import { Link } from "react-router-dom";
import Footer from "../components/Footer"; // adjust path if needed

export default function Home() {
  return (
    <div className="bg-black text-white">

      {/* HERO SECTION */}
      <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-6">
        <div className="max-w-5xl text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-wide">
            <span className="text-red-500">Steal</span>
            <span className="text-yellow-400">Deals</span>
            <br />
            <span className="text-white">Best Deals. Best Prices.</span>
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg sm:text-xl">
            Discover exclusive discounts on top products.  
            Shop smarter, save bigger, and grab the hottest deals before they’re gone.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/shop"
              className="bg-red-600 hover:bg-red-700 transition-all transform hover:scale-105 px-10 py-5 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:translate-y-1"
            >
              Shop Now
            </Link>

            <Link
              to="/register"
              className="border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 px-10 py-5 rounded-xl font-semibold hover:shadow-xl hover:translate-y-1"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "🔥 Hot Deals", desc: "Daily updated deals on trending products." },
            { title: "🚚 Fast Delivery", desc: "Quick & reliable delivery across India." },
            { title: "🔒 Secure Payments", desc: "Your transactions are always protected." }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-black border-2 border-red-600/30 rounded-2xl p-8 text-center hover:border-red-600 transition-all transform hover:scale-105 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">
                {item.title}
              </h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-red-600 to-red-700 text-center px-6">
        <h2 className="text-5xl font-extrabold mb-6 text-white">
          Don’t Miss Out on the Best Deals
        </h2>
        <p className="mb-8 text-lg text-red-100">
          Join thousands of smart shoppers today.
        </p>

        <Link
          to="/login"
          className="bg-black text-white px-12 py-5 rounded-xl font-semibold hover:bg-gray-900 transition-all transform hover:scale-105 hover:translate-y-1 shadow-xl"
        >
          Login to Continue
        </Link>
      </section>

    </div>
  );
}
