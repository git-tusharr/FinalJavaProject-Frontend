import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductInfoStep({ categoryData, brandData, onConfirm }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate slug automatically when name changes
  useEffect(() => {
    if (name) {
      const generatedSlug = name
        .toLowerCase()                     // lowercase
        .trim()                             // remove leading/trailing spaces
        .replace(/[^a-z0-9\s-]/g, "")      // remove special chars
        .replace(/\s+/g, "-");             // replace spaces with hyphens
      setSlug(generatedSlug);
    } else {
      setSlug("");
    }
  }, [name]);

  const handleSubmit = async () => {
    if (!name || !slug || !categoryData || !brandData) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name,
        slug,
        description,
        categoryId: categoryData.categoryId,
        brandId: brandData.id // always use ID for backend
      };

      const res = await axios.post("http://localhost:8080/api/products", payload);
      onConfirm(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-black border border-red-600/30 rounded-2xl p-10 shadow-2xl">
      <h2 className="text-3xl font-extrabold text-yellow-400 mb-2">
        Product Information
      </h2>
      <p className="text-gray-400 mb-8">
        Fill in product details for the selected category and brand
      </p>

      {/* FORM */}
      <div className="flex flex-col gap-6">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-900 text-white border border-gray-700 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <input
          type="text"
          placeholder="Slug (auto-generated)"
          value={slug}
          readOnly
          className="bg-gray-800 text-gray-400 border border-gray-700 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-900 text-white border border-gray-700 rounded-xl px-5 py-4 h-32 focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        {error && <p className="text-red-500 font-medium">{error}</p>}

        {loading ? (
          <p className="text-yellow-400 animate-pulse">Creating product...</p>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-black px-10 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl"
          >
            Create Product
          </button>
        )}
      </div>
    </div>
  );
}
