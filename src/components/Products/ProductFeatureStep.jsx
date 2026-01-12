import { useState, useEffect } from "react";
import { saveProductFeatures, getProductFeatures } from "../../api/productFeatureApi";

export default function ProductFeatureStep({ productData, onConfirm }) {
  const [features, setFeatures] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load existing features (optional, if editing)
  useEffect(() => {
    if (productData?.id) {
      getProductFeatures(productData.id).then((data) => {
        setFeatures(data.map((f) => f.feature));
      });
    }
  }, [productData]);

  // Add a feature to the list
  const handleAddFeature = () => {
    if (!inputValue.trim()) return;
    setFeatures((prev) => [...prev, inputValue.trim()]);
    setInputValue("");
  };

  // Remove a feature
  const handleRemoveFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // Save all features
  const handleSaveFeatures = async () => {
    if (!features.length) {
      setError("Add at least one feature");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await saveProductFeatures(productData.id, features);
      onConfirm(features); // pass features to parent summary
    } catch (err) {
      console.error(err);
      setError("Failed to save features");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-yellow-400">Add Product Features</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter feature"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="bg-gray-800 text-white rounded-xl px-4 py-2 flex-1"
        />
        <button
          onClick={handleAddFeature}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-xl font-bold"
        >
          Add
        </button>
      </div>

      {/* List of added features */}
      {features.length > 0 && (
        <ul className="mt-4 space-y-2">
          {features.map((f, idx) => (
            <li
              key={idx}
              className="bg-gray-900 text-white px-4 py-2 rounded-xl flex justify-between items-center"
            >
              {f}
              <button
                onClick={() => handleRemoveFeature(idx)}
                className="text-red-500 font-bold px-2"
              >
                X
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSaveFeatures}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 px-10 py-4 rounded-xl font-bold"
        >
          {loading ? "Saving..." : "Save Features"}
        </button>
      </div>
    </div>
  );
}
