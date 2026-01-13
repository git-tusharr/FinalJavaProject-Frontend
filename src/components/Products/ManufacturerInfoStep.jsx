import { useState, useEffect } from "react";
import { saveManufacturerInfo, getManufacturerInfo } from "../../api/manufacturerApi";

export default function ManufacturerInfoStep({ productData, onConfirm }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing manufacturer info if available
  useEffect(() => {
    if (productData?.id) {
      getManufacturerInfo(productData.id)
        .then((res) => {
          if (res?.content) setContent(res.content);
        })
        .catch((err) => console.error(err));
    }
  }, [productData]);

  const handleSave = async () => {
    if (!content.trim()) {
      setError("Manufacturer info cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await saveManufacturerInfo(productData.id, content);
      onConfirm(content); // pass to parent
    } catch (err) {
      console.error(err);
      setError("Failed to save manufacturer info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-yellow-400">Manufacturer Info</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter manufacturer info (e.g., Made in India, ISO certified)"
        className="w-full p-4 rounded-xl bg-gray-800 text-white h-40 resize-none"
      />

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-yellow-400 hover:bg-yellow-500 px-8 py-3 rounded-xl font-bold"
        >
          {loading ? "Saving..." : "Save & Next"}
        </button>
      </div>

      {content && (
        <div className="mt-6 bg-gray-900 p-4 rounded-xl">
          <h4 className="text-white font-semibold mb-2">Preview:</h4>
          <p className="text-gray-300">{content}</p>
        </div>
      )}
    </div>
  );
}
