import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [hoveredThumb, setHoveredThumb] = useState(null);
  const [categories, setCategories] = useState([]);

 useEffect(() => {
  fetch(`http://localhost:8080/api/products/slug/${slug}`)
    .then(res => res.json())
    .then(data => {
      console.log("Product data:", data); // check if categoryId exists
      setProduct(data);
      if (data.variants?.length > 0) setSelectedVariant(data.variants[0]);
      if (data.images?.length > 0) setMainImage(data.images[0]);

      // Use the correct category ID field
      const categoryId = data.categoryId || data.category?.id;
      if (categoryId) {
        fetch(`http://localhost:8080/api/categories/breadcrumb/${categoryId}`)
          .then(res => res.json())
          .then(catData => setCategories(catData))
          .catch(err => console.error("Breadcrumb fetch error:", err));
      } else {
        console.warn("No category ID found for product", data.id);
      } 
    });
}, [slug]);

  if (!product) {
    return <div className="text-center p-10 text-white">Loading...</div>;
  }

  // Build breadcrumb
  const breadcrumbs = [
    { name: "Home", href: "/" },
    ...categories.map(cat => ({ name: cat.name, href: `/category/${cat.slug}` })),
    { name: product.name, href: `/product/${slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      
      {/* BREADCRUMB */}
      <nav className="text-gray-400 text-sm mb-4 flex flex-wrap gap-1">
        {breadcrumbs.map((bc, idx) => (
          <span key={idx} className="flex items-center">
            {idx !== breadcrumbs.length - 1 ? (
              <>
                <Link to={bc.href} className="hover:underline">
                  {bc.name}
                </Link>
                <span className="mx-1">/</span>
              </>
            ) : (
              <span className="text-white font-semibold">{bc.name}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT: STICKY IMAGE SECTION */}
        <div className="lg:sticky lg:top-4 lg:self-start p-8 bg-gray-900 rounded-xl">
          <div className="flex gap-4">
            
            {/* Thumbnail Column */}
            <div className="flex flex-col gap-3">
              {product.images?.map((img, i) => (
                <div
                  key={i}
                  className="relative"
                  onMouseEnter={() => {
                    setMainImage(img);
                    setHoveredThumb(i);
                  }}
                  onMouseLeave={() => setHoveredThumb(null)}
                >
                  <img
                    src={img}
                    alt=""
                    className={`h-16 w-16 object-cover rounded cursor-pointer border-2 transition-all ${
                      mainImage === img
                        ? "border-yellow-400"
                        : "border-gray-700 hover:border-gray-500"
                    }`}
                  />
                  
                  {/* Enlarged thumbnail on hover */}
                  {hoveredThumb === i && (
                    <div className="absolute left-20 top-0 z-50 hidden lg:block">
                      <img
                        src={img}
                        alt=""
                        className="h-32 w-32 object-cover rounded-lg border-2 border-yellow-400 shadow-2xl bg-gray-900"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1">
              <img
                src={mainImage || "https://via.placeholder.com/500"}
                alt={product.name}
                className="rounded-xl w-full object-cover transition-transform hover:scale-105"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="flex-1 bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition">
              Add to Cart
            </button>

            <button className="flex-1 border-2 border-yellow-400 text-yellow-400 px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-black transition">
              Buy Now
            </button>
          </div>
        </div>

        {/* RIGHT: SCROLLABLE DETAILS */}
        <div className="p-8 space-y-6 text-white">
          
          {/* Product Title */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-yellow-400">
              {product.name}
            </h1>
            <p className="text-gray-400 mt-2">{product.brandName}</p>
          </div>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed">{product.description}</p>

          {/* PRICE SECTION */}
          {selectedVariant && (() => {
            const mrp = selectedVariant.mrp || Math.round(selectedVariant.price * 1.2);
            const price = selectedVariant.price;
            const discountAmount = mrp - price;
            const discountPercent = Math.round((discountAmount / mrp) * 100);

            return (
              <div className="bg-gray-900 p-6 rounded-xl space-y-3">
                <div className="text-4xl font-bold text-green-400">
                  ₹{price.toLocaleString()}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 line-through text-lg">
                    MRP ₹{mrp.toLocaleString()}
                  </span>
                  <span className="text-red-500 font-semibold text-lg">
                    {discountPercent}% OFF
                  </span>
                </div>
                <div className="text-green-500 font-medium">
                  You save ₹{discountAmount.toLocaleString()}
                </div>
              </div>
            );
          })()}

          {/* VARIANTS */}
          {product.variants?.length > 0 && (
            <div className="bg-gray-900 p-6 rounded-xl">
              <h4 className="font-semibold mb-4 text-lg">Select Variant</h4>
              <div className="flex flex-wrap gap-3">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-5 py-2 rounded-xl border-2 transition-all ${
                      selectedVariant?.id === variant.id
                        ? "border-yellow-400 bg-yellow-400 text-black font-semibold"
                        : "border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    SKU: {variant.sku}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STOCK STATUS */}
          {selectedVariant && (
            <div className="bg-gray-900 p-4 rounded-xl">
              <p
                className={`font-semibold text-lg ${
                  selectedVariant.stock > 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {selectedVariant.stock > 0
                  ? `✓ In Stock (${selectedVariant.stock} available)`
                  : "✗ Out of Stock"}
              </p>
            </div>
          )}

          {/* FEATURES */}
          {product.features?.length > 0 && (
            <section className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Key Features
              </h3>
              <ul className="space-y-3 text-gray-300">
                {product.features.map(f => (
                  <li key={f.id} className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span>{f.feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* SPECIFICATIONS */}
          {product.specifications?.length > 0 && (
            <section className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Specifications
              </h3>

              <div className="space-y-3">
                {product.specifications.map((s, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-3 border-b border-gray-800 last:border-0"
                  >
                    <span className="text-gray-400 font-medium">{s.specKey}</span>
                    <span className="text-white font-semibold">{s.specValue}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* MANUFACTURER INFO */}
          {product.manufacturerInfo?.content && (
            <section className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Manufacturer Information
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {product.manufacturerInfo.content}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
