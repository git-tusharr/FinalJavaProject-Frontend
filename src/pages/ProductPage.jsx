import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/slug/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        if (data.variants?.length > 0) {
          setSelectedVariant(data.variants[0]); // default variant
        }
      });
  }, [slug]);

  if (!product) {
    return <div className="text-center p-10 text-white">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT: IMAGES */}
        <div>
          <img
            src={product.images?.[0] || "https://via.placeholder.com/500"}
            alt={product.name}
            className="rounded-xl w-full object-cover"
          />

          <div className="flex gap-4 mt-4">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="h-20 w-20 object-cover rounded border border-gray-700"
              />
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-yellow-400">
            {product.name}
          </h1>

          <p className="text-gray-400">{product.brandName}</p>

          <p className="text-gray-300">{product.description}</p>

         {/* PRICE */}
{selectedVariant && (() => {
  const mrp = selectedVariant.mrp || Math.round(selectedVariant.price * 1.2); // fallback
  const price = selectedVariant.price;
  const discountAmount = mrp - price;
  const discountPercent = Math.round((discountAmount / mrp) * 100);

  return (
    <div className="space-y-2">
      {/* Final Price */}
      <div className="text-4xl font-bold text-green-400">
        ₹{price.toLocaleString()}
      </div>

      {/* MRP + Discount */}
      <div className="flex items-center gap-4">
        <span className="text-gray-400 line-through text-lg">
          ₹{mrp.toLocaleString()}
        </span>

        <span className="text-red-500 font-semibold">
          {discountPercent}% OFF
        </span>
      </div>

      {/* You Save */}
      <div className="text-green-500 font-medium">
        You save ₹{discountAmount.toLocaleString()}
      </div>
    </div>
  );
})()}

          {/* VARIANTS */}
          {product.variants?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Available Options</h4>

              <div className="flex flex-wrap gap-3">
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-5 py-2 rounded-xl border ${
                      selectedVariant?.id === variant.id
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : "border-gray-600"
                    }`}
                  >
                    SKU: {variant.sku}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STOCK */}
          {selectedVariant && (
            <p
              className={`font-semibold ${
                selectedVariant.stock > 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {selectedVariant.stock > 0
                ? `In Stock (${selectedVariant.stock})`
                : "Out of Stock"}
            </p>
          )}

          {/* CTA */}
          <div className="flex gap-6">
            <button className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold">
              Add to Cart
            </button>

            <button className="border border-yellow-400 px-8 py-4 rounded-xl font-bold">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      {product.features?.length > 0 && (
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            Features
          </h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            {product.features.map(f => (
              <li key={f.id}>{f.feature}</li>
            ))}
          </ul>
        </section>
      )}

      {/* SPECIFICATIONS */}
      {product.specifications?.length > 0 && (
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            Specifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications.map((s, i) => (
              <div
                key={i}
                className="bg-gray-900 p-4 rounded-xl flex justify-between"
              >
                <span className="text-gray-400">{s.specKey}</span>
                <span>{s.specValue}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MANUFACTURER */}
      {product.manufacturerInfo?.content && (
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            Manufacturer Info
          </h3>
          <p className="text-gray-300">
            {product.manufacturerInfo.content}
          </p>
        </section>
      )}
    </div>
  );
}