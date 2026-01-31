// import { useEffect, useState } from "react";
// import { getUserOrders } from "../services/CheckoutService";
// import { useAuth } from "../api/AuthContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function OrdersPage() {
//   const { auth } = useAuth();
//   const userId = auth?.userId;
//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!auth) {
//       toast.error("Please login first");
//       navigate("/login");
//       return;
//     }

//     const loadOrders = async () => {
//       try {
//         const res = await getUserOrders(userId);
//         setOrders(res.data);
//       } catch (err) {
//         toast.error("Failed to load orders");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadOrders();
//   }, [auth, userId, navigate]);

//   if (loading) {
//     return <div className="p-10 text-white text-center">Loading orders...</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 text-white">
//       <h1 className="text-3xl font-bold text-yellow-400 mb-6">
//         My Orders
//       </h1>

//       {orders.length === 0 ? (
//         <p className="text-gray-400">No orders found</p>
//       ) : (
//         <table className="w-full border border-gray-700 rounded-xl overflow-hidden">
//           <thead className="bg-gray-800">
//             <tr>
//               <th className="p-3 text-left">Product ID</th>
//               <th className="p-3 text-left">Quantity</th>
//               <th className="p-3 text-left">Price</th>
//               <th className="p-3 text-left">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((o) => (
//               <tr key={o.id} className="border-t border-gray-700">
//                 <td className="p-3">{o.productId}</td>
//                 <td className="p-3">{o.quantity}</td>
//                 <td className="p-3 text-green-400">₹{o.price}</td>
//                 <td className="p-3 text-yellow-400">{o.orderStatus}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axiosInstance";

export default function OrdersPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const userId = auth?.userId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (auth === null) return;

    if (!auth) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [auth, navigate]);

  /* ================= LOAD ORDERS ================= */
  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await API.get(`/auth/orders/user/${userId}`);
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const items = order.itemsJson
              ? JSON.parse(order.itemsJson)
              : [];

            const totalAmount = items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            return (
              <div
                key={order.id}
                className="bg-gray-900 rounded-xl p-5 border border-gray-800"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Order Number</p>
                    <p className="font-bold">{order.orderNumber}</p>
                  </div>

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-bold ${
                      order.orderStatus === "CONFIRMED"
                        ? "bg-green-500/20 text-green-400"
                        : order.orderStatus === "CANCELLED"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-gray-300"
                    >
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-700 my-4" />

                {/* Footer */}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-400">₹{totalAmount}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
