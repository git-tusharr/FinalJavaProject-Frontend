import { useEffect, useState } from "react";
import { getUserOrders } from "../services/CheckoutService";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const { auth } = useAuth();
  const userId = auth?.userId;
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const loadOrders = async () => {
      try {
        const res = await getUserOrders(userId);
        setOrders(res.data);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [auth, userId, navigate]);

  if (loading) {
    return <div className="p-10 text-white text-center">Loading orders...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders found</p>
      ) : (
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
      )}
    </div>
  );
}
