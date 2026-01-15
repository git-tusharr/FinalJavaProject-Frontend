import { useState } from "react";
import { saveSpecifications } from "../../api/specificationApi";

export default function ProductSpecificationStep({ productData, onConfirm }) {
  const [specs, setSpecs] = useState([{ specKey: "", specValue: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===========================
     Update spec
  ============================ */
  const handleChange = (index, field, value) => {
    setSpecs((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    );
  };

  /* ===========================
     Add / Remove
  ============================ */
  const handleAddSpec = () => {
    setSpecs((prev) => [...prev, { specKey: "", specValue: "" }]);
  };

  const handleRemoveSpec = (index) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  /* ===========================
     Save
  ============================ */
  const handleConfirm = async () => {
    if (specs.some((s) => !s.specKey.trim() || !s.specValue.trim())) {
      setError("All specification keys and values are required");
      return;
    }

    const keys = specs.map((s) => s.specKey.trim().toLowerCase());
    if (new Set(keys).size !== keys.length) {
      setError("Specification keys must be unique");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await saveSpecifications(productData.id, specs);
      onConfirm(specs);
    } catch (err) {
      console.error(err);
      setError("Failed to save specifications");
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     UI
  ============================ */
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-yellow-400">
          Product Specifications
        </h2>
        <p className="text-gray-400 mt-1">
          Add technical and detailed product information
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Specs */}
      <div className="space-y-4">
        {specs.map((spec, idx) => (
          <div
            key={idx}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Specification name (e.g. Weight)"
                value={spec.specKey}
                onChange={(e) =>
                  handleChange(idx, "specKey", e.target.value)
                }
                className="bg-gray-800 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400"
              />

              <input
                type="text"
                placeholder="Specification value (e.g. 1.5kg)"
                value={spec.specValue}
                onChange={(e) =>
                  handleChange(idx, "specValue", e.target.value)
                }
                className="bg-gray-800 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {specs.length > 1 && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleRemoveSpec(idx)}
                  className="text-red-400 hover:text-red-500 font-semibold"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <button
          onClick={handleAddSpec}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-bold text-black"
        >
          + Add Specification
        </button>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 px-10 py-3 rounded-xl font-bold text-black"
        >
          {loading ? "Saving..." : "Confirm Specifications"}
        </button>
      </div>
    </div>
  );
}
