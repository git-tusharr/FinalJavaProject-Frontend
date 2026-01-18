import { useEffect, useState } from "react";
import {
  getCart,
  decreaseItem,
  increaseItem,
  removeItem,
  clearCart,
} from "../services/CartService";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CartPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const userId = auth?.userId;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Protect route
  useEffect(() => {
    if (!auth) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [auth, navigate]);

  // 🔄 Load cart items
  const loadCart = async () => {
    try {
      const res = await getCart(userId);
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadCart();
  }, [userId]);

  // 🔽 Decrease quantity (optimistic)
  const handleDecrease = async (id) => {
    setItems(items.map(i => i.id === id ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i));
    await decreaseItem(id);
  };

  // 🔼 Increase quantity (optimistic)
  const handleIncrease = async (id) => {
    setItems(items.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
    await increaseItem(id);
  };

  // ❌ Remove item with confirmation
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      setItems(items.filter(i => i.id !== id));
      await removeItem(id);
      toast.success("Item removed");
    }
  };

  // 🧹 Clear cart
  const handleClear = async () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      await clearCart(userId);
      setItems([]);
      toast.success("Cart cleared");
    }
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 99;
  const total = subtotal + shipping;
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  if (loading) {
    return (
      <div className="p-10 text-white text-center">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-2">
        Shopping Cart ({totalItems} items)
      </h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl">Your cart is empty 🛒</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= LEFT: ITEMS ================= */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-gray-900 p-4 rounded-xl hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-28 w-28 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.productName}</h3>

                  <p className="text-green-400 font-semibold mt-1">
                    ₹{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      disabled={item.quantity === 1}
                      className={`px-3 py-1 rounded ${
                        item.quantity === 1
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gray-700"
                      }`}
                    >
                      −
                    </button>

                    <span className="font-bold">{item.quantity}</span>

                    <button
                      onClick={() => handleIncrease(item.id)}
                      className="px-3 py-1 bg-gray-700 rounded"
                    >
                      +
                    </button>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="ml-6 text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="font-bold text-lg">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}

            <button
              onClick={handleClear}
              className="text-red-400 hover:underline mt-4"
            >
              Clear Cart
            </button>
          </div>

          {/* ================= RIGHT: SUMMARY ================= */}
          <div className="bg-gray-900 p-6 rounded-xl h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>

              <hr className="border-gray-700" />

              <div className="flex justify-between text-xl font-bold text-white">
                <span>Total</span>
                <span className="text-green-400">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (!auth) {
                  toast.error("Please login first");
                  navigate("/login");
                  return;
                }
                navigate("/checkout");
              }}
              className="w-full mt-6 bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-500"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
