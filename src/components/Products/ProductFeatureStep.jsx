import { useState, useEffect } from "react";
import {
  saveProductFeatures,
  getProductFeatures,
} from "../../api/productFeatureApi";

export default function ProductFeatureStep({ productData, onConfirm }) {
  const [features, setFeatures] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===========================
     Load existing features
  ============================ */
  useEffect(() => {
    if (!productData?.id) return;

    getProductFeatures(productData.id)
      .then((data) => {
        setFeatures(data.map((f) => f.feature));
      })
      .catch(() => {
        setError("Failed to load existing features");
      });
  }, [productData]);

  /* ===========================
     Add feature
  ============================ */
  const handleAddFeature = () => {
    const value = inputValue.trim();
    if (!value) return;

    if (features.includes(value)) {
      setError("Feature already added");
      return;
    }

    setFeatures((prev) => [...prev, value]);
    setInputValue("");
    setError("");
  };

  /* ===========================
     Remove feature
  ============================ */
  const handleRemoveFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  /* ===========================
     Save features
  ============================ */
  const handleSaveFeatures = async () => {
    if (!features.length) {
      setError("Add at least one product feature");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await saveProductFeatures(productData.id, features);
      onConfirm(features);
    } catch (err) {
      console.error(err);
      setError("Failed to save product features");
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
          Product Features
        </h2>
        <p className="text-gray-400 mt-1">
          Add key highlights customers should know
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="e.g. Waterproof, 2 Year Warranty"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddFeature()}
          className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          onClick={handleAddFeature}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-bold text-black"
        >
          Add
        </button>
      </div>

      {/* Feature Chips */}
      {features.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-full"
            >
              <span>{feature}</span>
              <button
                onClick={() => handleRemoveFeature(idx)}
                className="text-red-400 hover:text-red-500 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleSaveFeatures}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 px-12 py-4 rounded-xl font-bold text-black transition"
        >
          {loading ? "Saving Features..." : "Save Features"}
        </button>
      </div>
    </div>
  );
}
