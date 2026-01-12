import { useEffect, useState } from "react";
import { getAllBrands } from "../../api/brandApi";

export default function SelectBrandStep({ onConfirm }) {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getAllBrands()
      .then((res) => setBrands(res.data || []))
      .catch(() => setError("Failed to load brands"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-6">

      <div className="max-w-5xl w-full bg-black border-2 border-red-600/30 rounded-3xl p-12 shadow-2xl">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide">
            <span className="text-red-500">Choose</span>{" "}
            <span className="text-yellow-400">Brand</span>
          </h2>
          <p className="text-gray-300 mt-4 text-lg">
            Select the brand for this product
          </p>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <p className="text-center text-yellow-400 animate-pulse">
            Loading brands...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 font-semibold">
            {error}
          </p>
        )}

        {/* BRAND GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <button
              key={brand.slug} // safe unique key
              onClick={() => setSelectedBrand(brand)}
              className={`group bg-black border-2 rounded-2xl p-8 text-center
                transition-all duration-300 transform
                ${
                  selectedBrand?.slug === brand.slug
                    ? "border-red-600 scale-105 shadow-2xl"
                    : "border-red-600/30 hover:border-red-600 hover:scale-105"
                }
              `}
            >
              {/* LOGO (optional) */}
              {brand.logoUrl && (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="h-20 mx-auto mb-4 object-contain
                             transition-transform duration-300
                             group-hover:scale-110"
                />
              )}

              {/* BRAND NAME */}
              <p className="text-xl font-bold tracking-wide text-white group-hover:text-yellow-400">
                {brand.name}
              </p>
            </button>
          ))}
        </div>

        {/* CONFIRM BUTTON */}
        {selectedBrand && typeof onConfirm === "function" && (
          <div className="mt-16 text-center">
            <button
              onClick={() => onConfirm(selectedBrand)}
              className="bg-red-600 hover:bg-red-700 text-white
                         px-14 py-5 rounded-xl font-bold text-lg
                         transition-all transform hover:scale-105
                         shadow-xl hover:shadow-2xl"
            >
              Confirm Brand
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
