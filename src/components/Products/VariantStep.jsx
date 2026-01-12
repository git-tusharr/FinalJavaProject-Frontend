import { useState } from "react";
import { createVariant } from "../../api/variantApi";

export default function VariantStep({ productData, attributesData, onConfirm }) {
  const [selectedValues, setSelectedValues] = useState({});
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleValueSelect = (attrId, valueId) => {
    setSelectedValues((prev) => ({ ...prev, [attrId]: valueId }));
  };

  // Add variant to local list (frontend)
  const handleAddVariant = () => {
    if (!sku || !price || !stock || Object.keys(selectedValues).length !== attributesData.length) {
      setError("Fill SKU, price, stock, and select values for all attributes");
      return;
    }

    setVariants([
      ...variants,
      {
        sku,
        price: parseFloat(price),
        stock: parseInt(stock),
        attributes: { ...selectedValues },
      },
    ]);

    // Reset inputs for next variant
    setSku("");
    setPrice("");
    setStock("");
    setSelectedValues({});
    setError("");
  };

  // Submit all variants to backend
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

      onConfirm(variants); // pass to parent for summary
      setVariants([]);
    } catch (err) {
      console.error(err);
      setError("Failed to save variants");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-yellow-400">Add Variants</h2>

      <div className="grid grid-cols-2 gap-4">
        {attributesData.map((attr) => (
          <div key={attr.id}>
            <label className="text-white font-semibold">{attr.name}</label>
            <select
              value={selectedValues[attr.id] || ""}
              onChange={(e) => handleValueSelect(attr.id, parseInt(e.target.value))}
              className="bg-gray-800 text-white rounded-xl px-4 py-2 w-full mt-1"
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

      <div className="grid grid-cols-3 gap-4 mt-4">
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="bg-gray-800 text-white rounded-xl px-4 py-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-gray-800 text-white rounded-xl px-4 py-2"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="bg-gray-800 text-white rounded-xl px-4 py-2"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleAddVariant}
          className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-xl font-bold"
        >
          Add Variant
        </button>
        <button
          onClick={handleConfirmAll}
          className="bg-yellow-400 hover:bg-yellow-500 px-8 py-3 rounded-xl font-bold"
          disabled={loading}
        >
          {loading ? "Saving..." : "Confirm All Variants"}
        </button>
      </div>

      {/* Display added variants */}
      {variants.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-yellow-400 font-bold">Variants Added</h3>
          <table className="w-full text-left border border-gray-700 rounded-xl overflow-hidden">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-gray-300">SKU</th>
                <th className="px-4 py-2 text-gray-300">Price</th>
                <th className="px-4 py-2 text-gray-300">Stock</th>
                <th className="px-4 py-2 text-gray-300">Attributes</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v, idx) => (
                <tr key={idx} className="border-t border-gray-700">
                  <td className="px-4 py-2 text-white">{v.sku}</td>
                  <td className="px-4 py-2 text-white">{v.price}</td>
                  <td className="px-4 py-2 text-white">{v.stock}</td>
                  <td className="px-4 py-2 text-gray-300">
                    {Object.entries(v.attributes)
                      .map(([attrId, valId]) => `Attr ${attrId}: Value ${valId}`)
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
