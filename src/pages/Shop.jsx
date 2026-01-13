import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/products/listing")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-yellow-400 mb-8">
        Shop Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.productId}
            className="bg-gray-900 rounded-xl shadow hover:scale-105 transition cursor-pointer"
            onClick={() =>
              navigate(`/product/${product.slug ?? product.productId}`)
            }
          >
            <img
              src={product.thumbnailUrl}
              alt={product.name}
              className="h-48 w-full object-cover rounded-t-xl"
            />

            <div className="p-4 space-y-2">
              <h3 className="text-white font-semibold">{product.name}</h3>

              <p className="text-yellow-400 font-bold">
                ₹{product.minPrice}{" "}
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
    </div>
  );
}