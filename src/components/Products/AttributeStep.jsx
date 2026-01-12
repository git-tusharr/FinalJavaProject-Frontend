import { useState } from "react";

export default function AttributeStep({ onConfirm }) {
  const [attrName, setAttrName] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [values, setValues] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [error, setError] = useState("");

  const handleAddValue = () => {
    if (valueInput.trim() === "") return;
    setValues([...values, valueInput.trim()]);
    setValueInput("");
  };

  const handleRemoveValue = (val) => {
    setValues(values.filter((v) => v !== val));
  };

  const handleAddAttribute = () => {
    if (!attrName || values.length === 0) {
      setError("Attribute name and at least one value are required");
      return;
    }

    // Add attribute with temporary IDs for frontend
    const newAttr = {
      id: attributes.length + 1,
      name: attrName,
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

  const handleConfirmAttributes = () => {
    if (attributes.length === 0) {
      setError("Add at least one attribute");
      return;
    }
    onConfirm(attributes);
  };

  return (
    <div className="max-w-4xl mx-auto bg-black border border-red-600/30 rounded-2xl p-10 shadow-2xl space-y-6">
      <h2 className="text-3xl font-extrabold text-yellow-400 mb-2">
        Add Product Attributes
      </h2>

      <input
        type="text"
        placeholder="Attribute Name (e.g., Color, Size)"
        value={attrName}
        onChange={(e) => setAttrName(e.target.value)}
        className="bg-gray-900 text-white border border-gray-700 rounded-xl px-5 py-4 w-full"
      />

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

      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v, i) => (
            <span
              key={i}
              className="bg-gray-800 text-white px-4 py-2 rounded-full flex items-center gap-2"
            >
              {v}
              <button onClick={() => handleRemoveValue(v)} className="text-red-500 font-bold">
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleAddAttribute}
        className="bg-green-500 hover:bg-green-600 px-10 py-3 rounded-xl font-bold"
      >
        Add Attribute
      </button>

      {attributes.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-yellow-400 font-bold text-xl">Added Attributes</h3>
          {attributes.map((attr) => (
            <div key={attr.id} className="bg-gray-900 p-4 rounded-xl">
              <p className="font-semibold text-white">{attr.name}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {attr.values.map((v) => (
                  <span key={v.id} className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                    {v.value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {attributes.length > 0 && (
        <button
          onClick={handleConfirmAttributes}
          className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-black px-12 py-4 rounded-xl font-bold"
        >
          Confirm Attributes
        </button>
      )}
    </div>
  );
}
