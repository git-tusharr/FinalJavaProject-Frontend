import { useEffect, useState } from "react";
import { checkoutUser } from "../services/CheckoutService";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { auth } = useAuth();
  const userId = auth?.userId;
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const placeOrder = async () => {
      try {
        const res = await checkoutUser(userId);
        setOrders(res.data);
        toast.success("Order placed successfully 🎉");
      } catch (err) {
        setError("Checkout failed");
        toast.error("Checkout failed");
      } finally {
        setLoading(false);
      }
    };

    placeOrder();
  }, [auth, userId, navigate]);

  if (loading) {
    return <div className="p-10 text-white text-center">Placing your order...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-400 text-center">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Order Successful ✅
      </h1>

      <table className="w-full border border-gray-700 rounded-xl overflow-hidden">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 text-left">Product ID</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t border-gray-700">
              <td className="p-3">{o.productId}</td>
              <td className="p-3">{o.quantity}</td>
              <td className="p-3 text-green-400">₹{o.price}</td>
              <td className="p-3 text-yellow-400">{o.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => navigate("/orders")}
        className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
      >
        View Orders
      </button>
    </div>
  );
}
