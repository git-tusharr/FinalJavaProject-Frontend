import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState([]);
  const navigate = useNavigate();
  const { auth } = useAuth();

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

  const addToCart = (product) => {
    if (!auth) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    const userId = auth.userId || auth.id || 1;
    const firstVariant = product.variants?.[0];

    if (!firstVariant) {
      toast.error("No variant available for this product");
      return;
    }

    const payload = {
      userId,
      productId: product.productId,
      variantId: firstVariant.id,
      quantity: 1,
    };

    fetch(`http://localhost:8080/api/cart/add/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(() => {
        toast.success(`${product.name} added to cart!`);
        setAddedToCart((prev) => [...prev, product.productId]);
      })
      .catch((err) => {
        console.error("Error adding to cart:", err);
        toast.error("Failed to add to cart");
      });
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-3xl font-bold text-yellow-400 mb-8">
        Shop Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => {
          const firstVariant = product.variants?.[0];

          // Fallbacks: if variant data not available, use product-level data
          const price = firstVariant?.price ?? product.minPrice ?? 0;
          const inStock =
            firstVariant?.stock != null ? firstVariant.stock > 0 : true;
          const image =
            firstVariant?.imageUrl ?? product.thumbnailUrl ?? "";

          if (!image) return null; // skip if no image

          const isAdded = addedToCart.includes(product.productId);

          return (
            <div
              key={product.productId}
              className="bg-gray-900 rounded-xl shadow hover:scale-105 transition cursor-pointer"
            >
              <img
                src={image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-t-xl"
                onClick={() =>
                  navigate(`/product/${product.slug ?? product.productId}`)
                }
              />

              <div className="p-4 space-y-2">
                <h3 className="text-white font-semibold">{product.name}</h3>

                <p className="text-yellow-400 font-bold">₹{price}</p>

                <span
                  className={`text-sm ${
                    inStock ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>

                {inStock && (
                  <button
                    className={`mt-2 w-full font-semibold py-1 rounded transition ${
                      isAdded
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-yellow-400 text-black hover:bg-yellow-500"
                    }`}
                    onClick={() => !isAdded && addToCart(product)}
                    disabled={isAdded}
                  >
                    {isAdded ? "Added" : "Add to Cart"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
