import { useState, useMemo } from "react";
import axios from "axios";

export default function VariantPricingStep({ variants, onConfirm }) {
  const [pricing, setPricing] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===========================
     Price calculation (safe)
  ============================ */
  const calculateFinalPrice = (mrp, type, value) => {
    if (!type || !value || value <= 0) return mrp;

    let discount = 0;

    if (type === "PERCENTAGE") {
      discount = Math.min((mrp * value) / 100, mrp);
    } else {
      discount = Math.min(value, mrp);
    }

    return Math.round((mrp - discount) * 100) / 100;
  };

  /* ===========================
     Handle change
  ============================ */
  const handleChange = (variantId, field, value) => {
    setPricing((prev) => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        [field]: value,
      },
    }));
  };

  /* ===========================
     Save pricing (optimized)
  ============================ */
  const savePricing = async () => {
    setLoading(true);
    setError("");

    try {
      const requests = variants.map((v) => {
        const p = pricing[v.id];
        if (!p || !p.discountType) return null;

        return axios.post(
          `http://localhost:8080/api/variants/${v.id}/pricing/price`,
          {
            mrp: v.price,
            sellingPrice: calculateFinalPrice(
              v.price,
              p.discountType,
              Number(p.discountValue)
            ),
            discountType: p.discountType,
            discountValue: Number(p.discountValue) || 0,
          }
        );
      });

      await Promise.all(requests.filter(Boolean));
      onConfirm(pricing);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to save pricing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     UI
  ============================ */
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-yellow-400">
          Variant Pricing
        </h2>

        <span className="text-gray-400 text-sm">
          {variants.length} variants
        </span>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Variant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {variants.map((v) => {
          const p = pricing[v.id] || {};
          const finalPrice = calculateFinalPrice(
            v.price,
            p.discountType,
            Number(p.discountValue)
          );

          return (
            <div
              key={v.id}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">SKU</p>
                  <p className="text-white font-semibold">{v.sku}</p>
                </div>

                <div className="text-right">
                  <p className="text-gray-400 text-sm">Base Price</p>
                  <p className="text-white font-bold">₹{v.price}</p>
                </div>
              </div>

              {/* Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Discount Type
                  </label>
                  <select
                    value={p.discountType || ""}
                    onChange={(e) =>
                      handleChange(v.id, "discountType", e.target.value)
                    }
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2"
                  >
                    <option value="">None</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={!p.discountType}
                    value={p.discountValue || ""}
                    onChange={(e) =>
                      handleChange(v.id, "discountValue", e.target.value)
                    }
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 disabled:opacity-40"
                    placeholder="Enter value"
                  />
                </div>
              </div>

              {/* Final Price */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <span className="text-gray-400">Final Price</span>
                <span className="text-green-400 text-xl font-bold">
                  ₹{finalPrice}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action */}
      <div className="flex justify-end pt-6">
        <button
          onClick={savePricing}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-black px-12 py-4 rounded-xl font-bold transition"
        >
          {loading ? "Saving Pricing..." : "Save Pricing"}
        </button>
      </div>
    </div>
  );
}
