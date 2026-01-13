import { useState } from "react";
import axios from "axios";

export default function AttributeStep({ onConfirm }) {
  const [attrName, setAttrName] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [values, setValues] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Add a value to the current attribute
  const handleAddValue = () => {
    if (valueInput.trim() === "") return;
    if (values.includes(valueInput.trim())) return; // prevent duplicates
    setValues([...values, valueInput.trim()]);
    setValueInput("");
  };

  // Remove a value from the current attribute
  const handleRemoveValue = (val) => {
    setValues(values.filter((v) => v !== val));
  };

  // Add the attribute locally to state
  const handleAddAttribute = () => {
    if (!attrName.trim() || values.length === 0) {
      setError("Attribute name and at least one value are required");
      return;
    }

    const newAttr = {
      id: attributes.length + 1,
      name: attrName.trim(),
      values: values.map((v, idx) => ({
        id: idx + 1,
        value: v,
      })),
    };

    setAttributes([...attributes, newAttr]);
    setAttrName("");
    setValues([]);
    setValueInput("");
    setError("");
  };

  // Confirm attributes: send POST requests to backend
  const handleConfirmAttributes = async () => {
    if (attributes.length === 0) {
      setError("Add at least one attribute");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Send each attribute to the backend
      for (let attr of attributes) {
        await axios.post("http://localhost:8080/api/attributes", {
          name: attr.name,
          values: attr.values.map((v) => v.value),
        });
      }

      setAttributes([]); // clear after success
      onConfirm(attributes); // send data to parent if needed
    } catch (err) {
      console.error(err);
      setError("Failed to save attributes to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-black border border-red-600/30 rounded-2xl p-10 shadow-2xl space-y-6">
      <h2 className="text-3xl font-extrabold text-yellow-400 mb-2">
        Add Product Attributes
      </h2>

      {/* Attribute Name Input */}
      <input
        type="text"
        placeholder="Attribute Name (e.g., Color, Size)"
        value={attrName}
        onChange={(e) => setAttrName(e.target.value)}
        className="bg-gray-900 text-white border border-gray-700 rounded-xl px-5 py-4 w-full"
      />

      {/* Value Input */}
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Enter Value (e.g., Red, Blue)"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-xl px-5 py-4"
          onKeyDown={(e) => e.key === "Enter" && handleAddValue()}
        />
        <button
          onClick={handleAddValue}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold"
        >
          Add Value
        </button>
      </div>

      {/* Show current values */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v, i) => (
            <span
              key={i}
              className="bg-gray-800 text-white px-4 py-2 rounded-full flex items-center gap-2"
            >
              {v}
              <button
                onClick={() => handleRemoveValue(v)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Add Attribute Button */}
      <button
        onClick={handleAddAttribute}
        className="bg-green-500 hover:bg-green-600 px-10 py-3 rounded-xl font-bold"
      >
        Add Attribute
      </button>

      {/* List of Added Attributes */}
      {attributes.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-yellow-400 font-bold text-xl">
            Added Attributes
          </h3>
          {attributes.map((attr) => (
            <div key={attr.id} className="bg-gray-900 p-4 rounded-xl">
              <p className="font-semibold text-white">{attr.name}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {attr.values.map((v) => (
                  <span
                    key={v.id}
                    className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {v.value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Attributes Button */}
      {attributes.length > 0 && (
        <button
          onClick={handleConfirmAttributes}
          disabled={loading}
          className={`mt-8 px-12 py-4 rounded-xl font-bold ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500 text-black"
          }`}
        >
          {loading ? "Saving..." : "Confirm Attributes"}
        </button>
      )}
    </div>
  );
}
