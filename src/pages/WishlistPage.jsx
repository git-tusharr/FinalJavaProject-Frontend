// src/pages/WishlistPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../api/AuthContext";
import { getWishlist, removeFromWishlist } from "../services/WishlistService";
import { addToCart } from "../services/CartService";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const userId = auth?.userId;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD WISHLIST ================= */
  const loadWishlist = async () => {
    try {
      const res = await getWishlist(userId);
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REMOVE ================= */
  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(userId, productId);
      toast.success("Removed from wishlist");
      loadWishlist();
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async (item) => {
    try {
      await addToCart(userId, {
        productId: item.productId,
        variantId: item.variantId || item.variant?.id,
        quantity: 1,
      });
      toast.success("Added to cart");
      navigate("/cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    if (!auth) {
      toast.error("Please login first");
      navigate("/login");
    } else {
      loadWishlist();
    }
  }, [auth]);

  /* ================= UI STATES ================= */
  if (loading)
    return <div className="p-10 text-center text-white">Loading wishlist...</div>;

  if (items.length === 0)
    return (
      <div className="p-12 text-center text-gray-400">
        <p className="text-lg mb-4">Your wishlist is empty 🤍</p>
        <Link
          to="/shop"
          className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500"
        >
          Continue Shopping
        </Link>
      </div>
    );

  /* ================= MAIN UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        My Wishlist
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const price =
            item.price ??
            item.variant?.price ??
            0;

          const stock =
            item.stock ??
            item.variant?.stock ??
            0;

          return (
            <div
              key={item.productId}
              className="bg-gray-900 rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition"
            >
              {/* IMAGE */}
              <Link to={`/product/${item.slug || item.productSlug}`}>
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="h-56 w-full object-cover"
                  />

                  {stock === 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-xs px-2 py-1 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>
              </Link>

              {/* DETAILS */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold hover:text-yellow-400">
                  {item.productName}
                </h3>

                {item.brandName && (
                  <p className="text-gray-400 text-sm">{item.brandName}</p>
                )}

                <div className="text-green-400 text-xl font-bold mt-2">
                  ₹{price.toLocaleString()}
                </div>

                {/* ACTIONS */}
                <div className="mt-auto flex gap-2 pt-4">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={stock === 0}
                    className={`flex-1 py-2 rounded-xl font-semibold ${
                      stock === 0
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-yellow-400 text-black hover:bg-yellow-500"
                    }`}
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
