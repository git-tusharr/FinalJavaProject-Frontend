import { useState } from "react";
import { updateOrderStatus } from "../api/orderApi";

const STATUSES = [
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED"
];

export default function AdminOrderStatus() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("CONFIRMED");
  const [msg, setMsg] = useState("");

  const handleUpdate = async () => {
    try {
      await updateOrderStatus(orderId, status);
      setMsg("✅ Status updated successfully");
    } catch {
      setMsg("❌ Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin – Update Order</h2>

      <input
        className="border p-2"
        placeholder="Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />

      <select
        className="border p-2 ml-3"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {STATUSES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        className="ml-3 bg-green-600 text-white px-4 py-2"
      >
        Update
      </button>

      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}
