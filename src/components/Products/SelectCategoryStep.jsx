import { useState } from "react";
import { getCategoryBreadcrumb } from "../../api/categoryApi";

export default function SelectCategoryStep({ onConfirm }) {
  const [categoryId, setCategoryId] = useState("");
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBreadcrumb = async () => {
    if (!categoryId) {
      setError("Category ID is required");
      return;
    }

    setLoading(true);
    setError("");
    setBreadcrumb([]);

    try {
      const res = await getCategoryBreadcrumb(categoryId);
      setBreadcrumb(res.data);
    } catch {
      setError("Invalid category ID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-black border border-red-600/30 rounded-2xl p-10 shadow-2xl">

      {/* TITLE */}
      <h2 className="text-3xl font-extrabold text-yellow-400 mb-2">
        Select Product Category
      </h2>
      <p className="text-gray-400 mb-8">
        Enter category ID to fetch its breadcrumb path
      </p>

      {/* INPUT */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="number"
          placeholder="Enter Category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-xl px-5 py-4
                     focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <button
          onClick={fetchBreadcrumb}
          className="bg-red-600 hover:bg-red-700 transition-all px-8 py-4 rounded-xl
                     font-semibold shadow-xl hover:scale-105"
        >
          Fetch Category
        </button>
      </div>

      {/* STATUS */}
      {loading && (
        <p className="mt-4 text-yellow-400 animate-pulse">
          Fetching category...
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-500 font-medium">
          {error}
        </p>
      )}

      {/* BREADCRUMB */}
      {breadcrumb.length > 0 && (
        <div className="mt-10 bg-gray-900 border border-gray-700 rounded-xl p-6">

          <p className="text-sm text-gray-400 mb-3">
            Selected Category Path
          </p>

          <div className="text-lg font-semibold text-white mb-6">
            {breadcrumb.map((c, i) => (
              <span key={c.id}>
                <span className="text-yellow-400">{c.name}</span>
                {i < breadcrumb.length - 1 && (
                  <span className="mx-2 text-gray-500">›</span>
                )}
              </span>
            ))}
          </div>

          <button
            onClick={() =>
              onConfirm({
                categoryId: breadcrumb[breadcrumb.length - 1].id,
                breadcrumb
              })
            }
            className="bg-green-500 hover:bg-green-600 text-black
                       px-10 py-4 rounded-xl font-bold
                       transition-all hover:scale-105 shadow-xl"
          >
            Confirm Category
          </button>
        </div>
      )}
    </div>
  );
}
