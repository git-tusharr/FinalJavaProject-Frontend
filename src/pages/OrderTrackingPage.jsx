import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { trackOrder } from "../services/OrderService";
import toast from "react-hot-toast";

export default function OrderTrackingPage() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await trackOrder(orderNumber);
        setOrder(res.data);
      } catch (err) {
        toast.error("Order not found");
        setTimeout(() => navigate("/orders"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, navigate]);

  const parseOrderItems = (itemsJson) => {
    try {
      return JSON.parse(itemsJson);
    } catch {
      return [];
    }
  };

  // Order tracking stages
  const stages = [
    { key: "CONFIRMED", label: "Order Confirmed", icon: "✓" },
    { key: "PACKED", label: "Packed", icon: "📦" },
    { key: "SHIPPED", label: "Shipped", icon: "🚚" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: "🛵" },
    { key: "DELIVERED", label: "Delivered", icon: "✅" }
  ];

  const getCurrentStageIndex = (status) => {
    const index = stages.findIndex(s => s.key === status);
    return index >= 0 ? index : 0;
  };

  const isStageCompleted = (stageIndex, currentStatus) => {
    if (["CANCELLED", "RETURN_REQUESTED", "RETURNED"].includes(currentStatus)) {
      return false;
    }
    return stageIndex <= getCurrentStageIndex(currentStatus);
  };

  if (loading) {
    return <div className="p-10 text-white text-center">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-10 text-red-400 text-center">Order not found</div>;
  }

  const items = parseOrderItems(order.itemsJson);
  const currentStageIndex = getCurrentStageIndex(order.orderStatus);

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/orders")}
          className="text-yellow-400 hover:text-yellow-300 mb-4"
        >
          ← Back to Orders
        </button>
        
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">
          Track Order
        </h1>
        <p className="text-gray-400">Order #{order.orderNumber}</p>
      </div>

      {/* Order Status - Timeline */}
      {!["CANCELLED", "RETURN_REQUESTED", "RETURNED"].includes(order.orderStatus) ? (
        <div className="bg-gray-800 rounded-xl p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6">Order Progress</h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-700">
              <div
                className="h-full bg-green-400 transition-all duration-500"
                style={{
                  width: `${(currentStageIndex / (stages.length - 1)) * 100}%`
                }}
              />
            </div>

            {/* Stages */}
            <div className="relative flex justify-between">
              {stages.map((stage, idx) => {
                const isCompleted = isStageCompleted(idx, order.orderStatus);
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage.key} className="flex flex-col items-center" style={{ width: '20%' }}>
                    {/* Circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 transition-all ${
                        isCompleted
                          ? "bg-green-400 text-white"
                          : "bg-gray-700 text-gray-400"
                      } ${isCurrent ? "ring-4 ring-yellow-400" : ""}`}
                    >
                      {stage.icon}
                    </div>
                    
                    {/* Label */}
                    <p
                      className={`text-sm text-center ${
                        isCompleted ? "text-white font-semibold" : "text-gray-400"
                      }`}
                    >
                      {stage.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-8 mb-6 text-center">
          <p className="text-2xl mb-2">
            {order.orderStatus === "CANCELLED" && "❌ Order Cancelled"}
            {order.orderStatus === "RETURN_REQUESTED" && "🔄 Return Requested"}
            {order.orderStatus === "RETURNED" && "✅ Order Returned"}
          </p>
          <p className="text-gray-400">
            {order.orderStatus === "CANCELLED" && "This order has been cancelled"}
            {order.orderStatus === "RETURN_REQUESTED" && "Your return request is being processed"}
            {order.orderStatus === "RETURNED" && "Order has been successfully returned"}
          </p>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">Order Items</h2>
        
        <table className="w-full">
          <thead className="text-left text-sm text-gray-400 border-b border-gray-700">
            <tr>
              <th className="pb-3">Product</th>
              <th className="pb-3">Quantity</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-700">
                <td className="py-3">{item.productId}</td>
                <td className="py-3">{item.quantity}</td>
                <td className="py-3 text-green-400">₹{item.price}</td>
                <td className="py-3 text-green-400">₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-right">
          <span className="text-xl font-bold text-green-400">
            Total: ₹{items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          </span>
        </div>
      </div>

      {/* Order Information */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">Order Information</h2>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Order Number</p>
            <p className="font-semibold">{order.orderNumber}</p>
          </div>
          
          <div>
            <p className="text-gray-400">Status</p>
            <p className="font-semibold text-green-400">
              {order.orderStatus.replace(/_/g, " ")}
            </p>
          </div>
          
          <div>
            <p className="text-gray-400">Order Date</p>
            <p className="font-semibold">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <p className="text-gray-400">Payment ID</p>
            <p className="font-semibold">{order.paymentId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}