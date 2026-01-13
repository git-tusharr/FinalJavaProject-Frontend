import { useEffect, useState } from "react";
import {
  getRootCategories,
  getSubCategories,
  getCategoryBreadcrumb
} from "../../api/categoryApi";

export default function SelectCategoryStep({ onConfirm }) {

  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load root categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async (parentId = null) => {
    setLoading(true);
    try {
      const res = parentId ? await getSubCategories(parentId) : await getRootCategories();
      setCategories(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (category) => {
    setSelectedId(category.id);

    // Fetch breadcrumb
    const bc = await getCategoryBreadcrumb(category.id);
    setBreadcrumb(bc.data);

    // Load children for next selection
    loadCategories(category.id);
  };

  return (
    <div className="max-w-5xl mx-auto bg-black border border-red-600/30 rounded-2xl p-10">

      <h2 className="text-3xl font-extrabold text-yellow-400 mb-6">
        Select Product Category
      </h2>

      {/* BREADCRUMB */}
      {breadcrumb.length > 0 && (
        <div className="mb-8 text-lg font-semibold text-white">
          {breadcrumb.map((c, i) => (
            <span key={c.id}>
              <span className="text-yellow-400">{c.name}</span>
              {i < breadcrumb.length - 1 && (
                <span className="mx-2 text-gray-500">›</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* CATEGORY LIST */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat)}
            className="bg-gray-900 border border-gray-700 text-white
                       px-6 py-4 rounded-xl hover:border-red-500
                       hover:scale-105 transition"
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading && (
        <p className="mt-6 text-yellow-400 animate-pulse">
          Loading categories...
        </p>
      )}

      {/* CONFIRM BUTTON */}
      {selectedId && (
        <div className="mt-10">
          <button
            onClick={() =>
              onConfirm({
                categoryId: selectedId,
                breadcrumb
              })
            }
            className="bg-green-500 hover:bg-green-600 text-black
                       px-12 py-4 rounded-xl font-bold shadow-xl
                       hover:scale-105 transition"
          >
            Confirm Category
          </button>
        </div>
      )}
    </div>
  );
}
