// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Footer from "../components/Footer";

// export default function Home() {
//   const [featured, setFeatured] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("http://localhost:8080/api/products/listing")
//       .then(res => res.json())
//       .then(data => setFeatured(data.slice(0, 4)))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div className="bg-black text-white">

//       {/* HERO */}
//       <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-6">
//         <div className="max-w-5xl text-center">
//           <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
//             <span className="text-red-500">Steal</span>
//             <span className="text-yellow-400">Deals</span>
//             <br />
//             Best Deals. Best Prices.
//           </h1>

//           <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
//             Discover exclusive discounts on top products.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-6 justify-center">
//             <Link
//               to="/shop"
//               className="bg-red-600 hover:bg-red-700 px-10 py-5 rounded-xl font-semibold transition-all hover:scale-105"
//             >
//               Shop Now
//             </Link>

//             <Link
//               to="/register"
//               className="border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-10 py-5 rounded-xl font-semibold transition-all hover:scale-105"
//             >
//               Create Account
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* FEATURED PRODUCTS */}
//       {featured.length > 0 && (
//         <section className="py-20 px-6 bg-gray-900">
//           <div className="max-w-7xl mx-auto">
//             <h2 className="text-4xl font-bold text-yellow-400 mb-10 text-center">
//               Featured Deals
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//               {featured.map(product => (
//                 <div
//                   key={product.productId}
//                   onClick={() =>
//                     navigate(`/product/${product.slug ?? product.productId}`)
//                   }
//                   className="bg-black rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition"
//                 >
//                   <img
//                     src={product.thumbnailUrl}
//                     alt={product.name}
//                     className="h-48 w-full object-cover"
//                   />

//                   <div className="p-4 space-y-2">
//                     <h3 className="font-semibold">{product.name}</h3>

//                     <p className="text-yellow-400 font-bold">
//                       ₹{product.minPrice}
//                       {product.maxPrice > product.minPrice &&
//                         ` - ₹${product.maxPrice}`}
//                     </p>

//                     <span
//                       className={`text-sm ${
//                         product.inStock
//                           ? "text-green-400"
//                           : "text-red-400"
//                       }`}
//                     >
//                       {product.inStock ? "In Stock" : "Out of Stock"}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="text-center mt-10">
//               <Link
//                 to="/shop"
//                 className="inline-block bg-yellow-400 text-black px-10 py-4 rounded-xl font-bold hover:scale-105 transition"
//               >
//                 View All Products →
//               </Link>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* FEATURES */}
//       <section className="py-24 px-6 bg-black">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
//           {[
//             { title: "🔥 Hot Deals", desc: "Daily updated deals on trending products." },
//             { title: "🚚 Fast Delivery", desc: "Quick & reliable delivery across India." },
//             { title: "🔒 Secure Payments", desc: "Your transactions are always protected." }
//           ].map((item, i) => (
//             <div
//               key={i}
//               className="border border-red-600/30 rounded-2xl p-8 text-center hover:border-red-600 transition"
//             >
//               <h3 className="text-2xl font-bold text-yellow-400 mb-3">
//                 {item.title}
//               </h3>
//               <p className="text-gray-300">{item.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-24 bg-gradient-to-r from-red-600 to-red-700 text-center px-6">
//         <h2 className="text-5xl font-extrabold mb-6">
//           Don’t Miss Out on the Best Deals
//         </h2>

//         <Link
//           to="/login"
//           className="bg-black px-12 py-5 rounded-xl font-semibold hover:scale-105 transition"
//         >
//           Login to Continue
//         </Link>
//       </section>

      
//     </div>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../api/AuthContext"; // ✅ import AuthContext
import Footer from "../components/Footer";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const { auth } = useAuth(); // ✅ get auth info
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/products/listing")
      .then((res) => res.json())
      .then((data) => setFeatured(data.slice(0, 4)))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-black text-white">

      {/* HERO */}
      <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-6">
        <div className="max-w-5xl text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            <span className="text-red-500">Steal</span>
            <span className="text-yellow-400">Deals</span>
            <br />
            Best Deals. Best Prices.
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
            {auth
              ? `Welcome back, ${auth.username}! Discover the latest deals curated just for you.`
              : "Discover exclusive discounts on top products."}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/shop"
              className="bg-red-600 hover:bg-red-700 px-10 py-5 rounded-xl font-semibold transition-all hover:scale-105"
            >
              Shop Now
            </Link>

            {!auth && (
              <Link
                to="/register"
                className="border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-10 py-5 rounded-xl font-semibold transition-all hover:scale-105"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="py-20 px-6 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-yellow-400 mb-10 text-center">
              Featured Deals
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {featured.map((product) => (
                <div
                  key={product.productId}
                  onClick={() =>
                    navigate(`/product/${product.slug ?? product.productId}`)
                  }
                  className="bg-black rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition"
                >
                  <img
                    src={product.thumbnailUrl}
                    alt={product.name}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold">{product.name}</h3>

                    <p className="text-yellow-400 font-bold">
                      ₹{product.minPrice}
                      {product.maxPrice > product.minPrice &&
                        ` - ₹${product.maxPrice}`}
                    </p>

                    <span
                      className={`text-sm ${
                        product.inStock ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/shop"
                className="inline-block bg-yellow-400 text-black px-10 py-4 rounded-xl font-bold hover:scale-105 transition"
              >
                View All Products →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "🔥 Hot Deals", desc: "Daily updated deals on trending products." },
            { title: "🚚 Fast Delivery", desc: "Quick & reliable delivery across India." },
            { title: "🔒 Secure Payments", desc: "Your transactions are always protected." }
          ].map((item, i) => (
            <div
              key={i}
              className="border border-red-600/30 rounded-2xl p-8 text-center hover:border-red-600 transition"
            >
              <h3 className="text-2xl font-bold text-yellow-400 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-red-600 to-red-700 text-center px-6">
        <h2 className="text-5xl font-extrabold mb-6">
          {auth ? "Ready to grab more deals?" : "Don’t Miss Out on the Best Deals"}
        </h2>

        {auth ? (
          <Link
            to="/shop"
            className="bg-black px-12 py-5 rounded-xl font-semibold hover:scale-105 transition"
          >
            Browse Deals
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-black px-12 py-5 rounded-xl font-semibold hover:scale-105 transition"
          >
            Login to Continue
          </Link>
        )}
      </section>

    </div>
  );
}
