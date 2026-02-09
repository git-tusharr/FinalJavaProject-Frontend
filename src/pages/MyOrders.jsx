import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await API.get(`/orders/user/${userId}`);
const parsedOrders = res.data.map(order => {
  let items = [];

  if (order.itemsJson) {
    try {
      items =
        typeof order.itemsJson === "string"
          ? JSON.parse(order.itemsJson)
          : order.itemsJson;
    } catch (e) {
      console.error("Invalid itemsJson for order:", order.orderNumber);
      items = [];
    }
  }

  return {
    ...order,
    items
  };
});

      setOrders(parsedOrders);
    };

    loadOrders();
  }, []);

  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

      {orders.map(order => (
        <div
          key={order.orderNumber}
          className="border rounded-lg mb-6 bg-white shadow-sm"
        >
          {/* ORDER HEADER */}
          <div className="flex justify-between bg-gray-100 p-4 rounded-t">
            <div>
              <p className="text-sm text-gray-600">ORDER PLACED</p>
              <p className="text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">ORDER #</p>
              <p className="text-sm font-medium">{order.orderNumber}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">STATUS</p>
              <p className="text-sm font-semibold text-blue-600">
                {order.orderStatus}
              </p>
            </div>
          </div>

          {/* ORDER ITEMS */}
          <div className="p-4">
            {order.items.map(item => (
              <div
                key={item.productId}
                className="flex gap-4 border-b py-4 last:border-b-0"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-sm font-semibold">
                    ₹{item.price}
                  </p>
                  {/* WRITE REVIEW BUTTON */}
<button
  onClick={() =>
    navigate(`/review/${item.productId}/${order.orderNumber}`)
  }
  className="mt-2 text-sm text-orange-600 font-medium hover:underline"
>
  Write a review
</button>

                </div>
              </div>
            ))}

            {/* ACTION */}
            <div className="mt-4 text-right">
              <button
                onClick={() => navigate(`/orders/${order.orderNumber}`)}
                className="text-blue-600 font-medium hover:underline"
              >
                View order details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
