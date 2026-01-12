import { useState } from "react";
import axios from "axios";

export default function VariantPricingStep({ variants, onConfirm }) {
  const [pricing, setPricing] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔢 Calculate final price
  const calculateFinalPrice = (mrp, type, value) => {
    if (!type || !value) return mrp;

    const discount =
      type === "PERCENTAGE"
        ? (mrp * value) / 100
        : value;

    return Math.max(mrp - discount, 0);
  };

  // 🔄 Handle input change
  const handleChange = (variantId, field, value) => {
    setPricing((prev) => {
      const current = prev[variantId] || {};
      return {
        ...prev,
        [variantId]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  // 💾 Save pricing
  const savePricing = async () => {
    setLoading(true);
    setError("");

    try {
      for (const v of variants) {
        const p = pricing[v.id];
        if (!p) continue;

        await axios.post(
          `http://localhost:8080/api/variants/${v.id}/pricing/price`,
          {
            mrp: v.price,               // 👈 auto from variant
            sellingPrice: calculateFinalPrice(
              v.price,
              p.discountType,
              Number(p.discountValue)
            ),
            discountType: p.discountType,
            discountValue: Number(p.discountValue),
          }
        );
      }

      onConfirm(pricing);
    } catch (err) {
      console.error(err);
      setError("Failed to save pricing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-yellow-400">
        Variant Pricing
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border border-gray-700 rounded-xl overflow-hidden">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-gray-300">SKU</th>
            <th className="px-4 py-2 text-gray-300">Base Price</th>
            <th className="px-4 py-2 text-gray-300">Discount Type</th>
            <th className="px-4 py-2 text-gray-300">Discount Value</th>
            <th className="px-4 py-2 text-gray-300">Final Price</th>
          </tr>
        </thead>

        <tbody>
          {variants.map((v) => {
            const p = pricing[v.id] || {};
            const finalPrice = calculateFinalPrice(
              v.price,
              p.discountType,
              Number(p.discountValue)
            );

            return (
              <tr key={v.id} className="border-t border-gray-700">
                <td className="px-4 py-2 text-white">{v.sku}</td>

                <td className="px-4 py-2 text-white">
                  ₹{v.price}
                </td>

                <td className="px-4 py-2">
                  <select
                    value={p.discountType || ""}
                    onChange={(e) =>
                      handleChange(v.id, "discountType", e.target.value)
                    }
                    className="bg-gray-800 text-white rounded-lg px-3 py-2 w-full"
                  >
                    <option value="">None</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat (₹)</option>
                  </select>
                </td>

                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={p.discountValue || ""}
                    onChange={(e) =>
                      handleChange(v.id, "discountValue", e.target.value)
                    }
                    className="bg-gray-800 text-white rounded-lg px-3 py-2 w-full"
                    placeholder="Enter discount"
                  />
                </td>

                <td className="px-4 py-2 text-green-400 font-bold">
                  ₹{finalPrice}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-end">
        <button
          onClick={savePricing}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold transition"
        >
          {loading ? "Saving..." : "Save Pricing"}
        </button>
      </div>
    </div>
  );
}
