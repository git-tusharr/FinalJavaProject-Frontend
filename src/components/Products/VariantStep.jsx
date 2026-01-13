import { useState, useEffect } from "react";
import { createVariant, getVariants } from "../../api/variantApi";

export default function VariantStep({ productData, attributesData, onConfirm }) {
  const [selectedValues, setSelectedValues] = useState({});
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🏷️ Generate SKU using actual attribute values
  useEffect(() => {
    if (Object.keys(selectedValues).length === attributesData.length) {
      const skuParts = attributesData.map((attr) => {
        const valueId = selectedValues[attr.id];
        const valueObj = attr.values.find((v) => v.id === valueId);
        return valueObj ? valueObj.value.replace(/\s+/g, "-").toUpperCase() : "";
      });
      setSku(`${productData.slug.toUpperCase()}-${skuParts.join("-")}`);
    } else {
      setSku("");
    }
  }, [selectedValues, attributesData, productData.slug]);

  const handleValueSelect = (attrId, valueId) => {
    setSelectedValues((prev) => ({ ...prev, [attrId]: Number(valueId) }));
  };

  // ➕ Add variant locally
  const handleAddVariant = () => {
    if (
      !sku ||
      !price ||
      !stock ||
      Object.keys(selectedValues).length !== attributesData.length
    ) {
      setError("Fill SKU, price, stock, and select values for all attributes");
      return;
    }

    setVariants((prev) => [
      ...prev,
      {
        sku,
        price: Number(price),
        stock: Number(stock),
        attributes: { ...selectedValues },
      },
    ]);

    // reset inputs
    setPrice("");
    setStock("");
    setSelectedValues({});
    setSku("");
    setError("");
  };

  // 🚀 Save all variants and fetch saved variants with IDs
  const handleConfirmAll = async () => {
    if (variants.length === 0) {
      setError("Add at least one variant before confirming");
      return;
    }

    setLoading(true);
    setError("");

    try {
      for (const v of variants) {
        await createVariant(productData.id, v);
      }

      const savedVariants = await getVariants(productData.id);
      onConfirm(savedVariants);
      setVariants([]);
    } catch (err) {
      console.error(err);
      setError("Failed to save variants");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-900 rounded-2xl shadow-xl border border-red-600/20 space-y-6">
      <h2 className="text-3xl font-extrabold text-yellow-400">Add Product Variants</h2>
      <p className="text-gray-400">Select attribute combinations and provide SKU, price, and stock.</p>

      {/* Attribute Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {attributesData.map((attr) => (
          <div key={attr.id} className="flex flex-col">
            <label className="text-white font-semibold mb-2">{attr.name}</label>
            <select
              value={selectedValues[attr.id] || ""}
              onChange={(e) => handleValueSelect(attr.id, e.target.value)}
              className="bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select {attr.name}</option>
              {attr.values.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* SKU / Price / Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <input
          type="text"
          placeholder="SKU (auto-generated)"
          value={sku}
          readOnly
          className="bg-gray-800 text-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {error && <p className="text-red-500 font-medium">{error}</p>}

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mt-4">
        <button
          onClick={handleAddVariant}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-bold transition transform hover:scale-105 shadow-lg"
        >
          Add Variant
        </button>

        <button
          onClick={handleConfirmAll}
          className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded-xl font-bold transition transform hover:scale-105 shadow-lg"
          disabled={loading}
        >
          {loading ? "Saving..." : "Confirm All Variants"}
        </button>
      </div>

      {/* Preview of added variants */}
      {variants.length > 0 && (
        <div className="mt-6 bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h3 className="text-white font-bold mb-2">Variants Preview:</h3>
          <ul className="text-gray-300 space-y-1">
            {variants.map((v, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{v.sku}</span>
                <span>${v.price}</span>
                <span>Stock: {v.stock}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
