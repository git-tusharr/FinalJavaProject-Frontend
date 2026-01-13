import { useState } from "react";
import { saveSpecifications } from "../../api/specificationApi";

export default function ProductSpecificationStep({ productData, onConfirm }) {
  const [specs, setSpecs] = useState([{ specKey: "", specValue: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { specKey: "", specValue: "" }]);
  };

  const handleRemoveSpec = (index) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
  };

  const handleConfirm = async () => {
    if (specs.some((s) => !s.specKey || !s.specValue)) {
      setError("Fill all specification keys and values");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await saveSpecifications(productData.id, specs);
      onConfirm(specs); // send to parent
    } catch (err) {
      console.error(err);
      setError("Failed to save specifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-yellow-400 mb-4">Add Product Specifications</h2>

      {specs.map((s, idx) => (
        <div key={idx} className="grid grid-cols-2 gap-4 mb-2">
          <input
            type="text"
            placeholder="Specification Key"
            value={s.specKey}
            onChange={(e) => handleChange(idx, "specKey", e.target.value)}
            className="bg-gray-800 text-white rounded-xl px-4 py-2"
          />
          <input
            type="text"
            placeholder="Specification Value"
            value={s.specValue}
            onChange={(e) => handleChange(idx, "specValue", e.target.value)}
            className="bg-gray-800 text-white rounded-xl px-4 py-2"
          />
          {specs.length > 1 && (
            <button
              onClick={() => handleRemoveSpec(idx)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl col-span-2 mt-1"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={handleAddSpec}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-xl font-bold"
        >
          Add Specification
        </button>
        <button
          onClick={handleConfirm}
          className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-xl font-bold"
          disabled={loading}
        >
          {loading ? "Saving..." : "Confirm Specifications"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
