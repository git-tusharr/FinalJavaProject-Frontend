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
import { getUserOrders, cancelOrder, returnOrder } from "../services/OrderService";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const { auth } = useAuth();
  const userId = auth?.userId;
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!auth) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    loadOrders();
  }, [auth, userId, navigate]);

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

  const handleCancelOrder = async (orderId, orderStatus) => {
    if (!["CONFIRMED", "PACKED"].includes(orderStatus)) {
      toast.error("Order cannot be cancelled at this stage");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      loadOrders(); // Reload orders
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  const handleReturnOrder = async (orderId, orderStatus) => {
    if (orderStatus !== "DELIVERED") {
      toast.error("Return allowed only after delivery");
      return;
    }

    if (!window.confirm("Are you sure you want to return this order?")) {
      return;
    }

    try {
      await returnOrder(orderId);
      toast.success("Return request submitted");
      loadOrders(); // Reload orders
    } catch (err) {
      toast.error("Failed to submit return request");
    }
  };

  const parseOrderItems = (itemsJson) => {
    try {
      return JSON.parse(itemsJson);
    } catch {
      return [];
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      CONFIRMED: "text-blue-400",
      PACKED: "text-purple-400",
      SHIPPED: "text-indigo-400",
      OUT_FOR_DELIVERY: "text-yellow-400",
      DELIVERED: "text-green-400",
      CANCELLED: "text-red-400",
      RETURN_REQUESTED: "text-orange-400",
      RETURNED: "text-gray-400"
    };
    return colors[status] || "text-gray-400";
  };

  const canCancel = (status) => {
    return ["CONFIRMED", "PACKED"].includes(status);
  };

  const canReturn = (status) => {
    return status === "DELIVERED";
  };

  if (loading) {
    return <div className="p-10 text-white text-center">Loading orders...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4">No orders found</p>
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = parseOrderItems(order.itemsJson);
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
              >
                {/* Order Header */}
                <div className="p-4 bg-gray-750">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-400">Order Number</p>
                      <p className="font-bold text-lg">{order.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Status</p>
                      <p className={`font-bold text-lg ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      {isExpanded ? "Hide Details ▲" : "View Details ▼"}
                    </button>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {isExpanded && (
                  <div className="p-4">
                    {/* Order Items */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2 text-yellow-400">Items</h3>
                      <table className="w-full">
                        <thead className="text-left text-sm text-gray-400 border-b border-gray-700">
                          <tr>
                            <th className="pb-2">Product ID</th>
                            <th className="pb-2">Quantity</th>
                            <th className="pb-2">Price</th>
                            <th className="pb-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-700">
                              <td className="py-2">{item.productId}</td>
                              <td className="py-2">{item.quantity}</td>
                              <td className="py-2 text-green-400">₹{item.price}</td>
                              <td className="py-2 text-green-400">
                                ₹{item.price * item.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      <div className="mt-3 text-right">
                        <span className="text-lg font-bold text-green-400">
                          Total: ₹
                          {items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      {canCancel(order.orderStatus) && (
                        <button
                          onClick={() => handleCancelOrder(order.id, order.orderStatus)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                          Cancel Order
                        </button>
                      )}

                      {canReturn(order.orderStatus) && (
                        <button
                          onClick={() => handleReturnOrder(order.id, order.orderStatus)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                          Return Order
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/track/${order.orderNumber}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}