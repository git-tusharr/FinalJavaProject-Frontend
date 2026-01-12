import { useState } from "react";
import { createVariant, getVariants } from "../../api/variantApi";

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

    setSku("");
    setPrice("");
    setStock("");
    setSelectedValues({});
    setError("");
  };

  // 🚀 Save variants → then FETCH variants WITH IDs
  const handleConfirmAll = async () => {
    if (variants.length === 0) {
      setError("Add at least one variant before confirming");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1️⃣ Create variants
      for (const v of variants) {
        await createVariant(productData.id, v);
      }

      // 2️⃣ Fetch saved variants WITH IDs
      const savedVariants = await getVariants(productData.id);

      // 3️⃣ Pass correct data to next step
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
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-yellow-400">Add Variants</h2>

      <div className="grid grid-cols-2 gap-4">
        {attributesData.map((attr) => (
          <div key={attr.id}>
            <label className="text-white font-semibold">{attr.name}</label>
            <select
              value={selectedValues[attr.id] || ""}
              onChange={(e) =>
                handleValueSelect(attr.id, Number(e.target.value))
              }
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
    </div>
  );
}
