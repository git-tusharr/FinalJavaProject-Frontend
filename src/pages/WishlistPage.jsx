// src/pages/WishlistPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../api/AuthContext";
import {
  getWishlist,
  removeFromWishlist,
} from "../services/WishlistService";
import { addToCart } from "../services/CartService";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function WishlistPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const userId = auth?.userId;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      const res = await getWishlist(userId);
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to load wishlist");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(userId, productId);
      toast.success("Removed from wishlist");
      loadWishlist();
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(userId, {
        productId: product.productId,
        variantId: product.variantId || 1, // default variant if none
        quantity: 1,
      });
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!auth) {
      toast.error("Please login first");
      navigate("/login");
    } else {
      loadWishlist();
    }
  }, [auth, userId]);

  if (loading)
    return <div className="p-10 text-white text-center">Loading wishlist...</div>;

  if (items.length === 0)
    return (
      <div className="p-10 text-center text-gray-400">
        Your wishlist is empty 😢
        <div className="mt-4">
          <Link
            to="/shop"
            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Your Wishlist
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.productId}
            className="bg-gray-900 rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <Link to={`/product/${item.slug}`}>
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="h-56 w-full object-cover"
                />
                {item.stock === 0 && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
            </Link>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-bold hover:text-yellow-400 transition">
                <Link to={`/product/${item.slug}`}>{item.productName}</Link>
              </h3>
              <p className="text-gray-400 text-sm mt-1">{item.brandName}</p>
              <div className="text-green-400 font-bold text-lg mt-2">
                ₹{item.price.toLocaleString()}
              </div>

              {/* Variant Info */}
              {item.variantSku && (
                <div className="text-gray-300 text-sm mt-1">
                  SKU: {item.variantSku}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto flex gap-2 pt-4">
                <button
                  onClick={() => handleAddToCart(item)}
                  className={`flex-1 bg-yellow-400 text-black font-semibold py-2 rounded-xl hover:bg-yellow-500 transition ${
                    item.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={item.stock === 0}
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => handleRemove(item.productId)}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl font-semibold transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
