import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../api/productApi";
import { getImages } from "../api/productImageApi"; // To fetch images for product/variant

export default function Product() {
  const { slug } = useParams(); // Use the slug to get the product details from the API
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    // Fetch product data
    const fetchProduct = async () => {
      try {
        const res = await getProductBySlug(slug);
        setProduct(res.data);

        // Fetch images related to the product
        const imagesRes = await getImages(res.data.id, selectedVariant?.id);
        setImages(imagesRes.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [slug, selectedVariant]); // Re-fetch if the variant changes

  if (!product) {
    return <div>Loading...</div>; // Placeholder for loading state
  }

  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      {/* Product Name and Price */}
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-6">{product.name}</h1>
        <p className="text-xl text-red-500 font-bold mb-8">${product.price}</p>

        {/* Product Image Gallery */}
        <div className="flex justify-center gap-8">
          <div className="w-96">
            <img
              src={images.length > 0 ? images[0]?.imageUrl : "/assets/placeholder.png"}
              alt={product.name}
              className="w-full h-64 object-cover rounded-xl mb-4"
            />
            <div className="flex gap-4">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.imageUrl}
                  alt={`variant ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded-xl cursor-pointer"
                  onClick={() => setSelectedVariant(img)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="w-96 text-left">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Product Details</h3>
            <p className="text-gray-300 mb-4">{product.description}</p>

            {/* Variants (if any) */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-yellow-400 mb-2">Variants</h4>
                <div className="flex gap-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg ${
                        selectedVariant?.id === variant.id
                          ? "bg-red-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white"
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart / Buy Now */}
            <div className="mt-8">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
