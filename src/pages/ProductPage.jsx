// import { useParams, Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { addToCart } from "../services/CartService";
// import { useAuth } from "../api/AuthContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";


// export default function ProductPage() {
//   const { slug } = useParams();

//   const { auth } = useAuth();      // ✅ REQUIRED
//   const navigate = useNavigate(); // ✅ REQUIRED

//   const [product, setProduct] = useState(null);
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [mainImage, setMainImage] = useState("");
//   const [hoveredThumb, setHoveredThumb] = useState(null);


//   useEffect(() => {
//     fetch(`http://localhost:8080/api/products/slug/${slug}`)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Product data:", data);
//         setProduct(data);

//         if (data.variants?.length > 0) {
//           setSelectedVariant(data.variants[0]); // ✅ first variant
//         }

//         if (data.images?.length > 0) {
//           setMainImage(data.images[0]);
//         }
//       })
//       .catch((err) => console.error("Product fetch error:", err));
//   }, [slug]);

//   if (!product) {
//     return <div className="text-center p-10 text-white">Loading...</div>;
//   }

//   /* ===================== BREADCRUMBS ===================== */
//   const breadcrumbs = [
//     { name: "Home", href: "/" },
//     ...(product.breadcrumb?.map((b) => ({ name: b, href: "#" })) || []),
//     { name: product.name, href: `/product/${slug}` },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto p-4">

//       {/* ===================== BREADCRUMB ===================== */}
//       <nav className="text-gray-400 text-sm mb-4 flex flex-wrap gap-1">
//         {breadcrumbs.map((bc, idx) => (
//           <span key={idx} className="flex items-center">
//             {idx !== breadcrumbs.length - 1 ? (
//               <>
//                 <Link to={bc.href} className="hover:underline">
//                   {bc.name}
//                 </Link>
//                 <span className="mx-1">/</span>
//               </>
//             ) : (
//               <span className="text-white font-semibold">{bc.name}</span>
//             )}
//           </span>
//         ))}
//       </nav>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//         {/* ===================== LEFT IMAGE ===================== */}
//         <div className="lg:sticky lg:top-4 bg-gray-900 rounded-xl p-6">
//           <div className="flex gap-4">

//             {/* Thumbnails */}
//             <div className="flex flex-col gap-3">
//               {product.images?.map((img, i) => (
//                 <div
//                   key={i}
//                   onMouseEnter={() => {
//                     setMainImage(img);
//                     setHoveredThumb(i);
//                   }}
//                   onMouseLeave={() => setHoveredThumb(null)}
//                   className="relative"
//                 >
//                   <img
//                     src={img}
//                     alt=""
//                     className={`h-16 w-16 object-cover rounded border-2 cursor-pointer ${
//                       mainImage === img
//                         ? "border-yellow-400"
//                         : "border-gray-700 hover:border-gray-500"
//                     }`}
//                   />

//                   {hoveredThumb === i && (
//                     <div className="absolute left-20 top-0 z-50 hidden lg:block">
//                       <img
//                         src={img}
//                         alt=""
//                         className="h-32 w-32 object-cover rounded-xl border-2 border-yellow-400 bg-gray-900 shadow-xl"
//                       />
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Main Image */}
//             <div className="flex-1">
//               <img
//                 src={mainImage}
//                 alt={product.name}
//                 className="rounded-xl w-full object-cover hover:scale-105 transition"
//               />
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-4 mt-6">
// <button
//   onClick={async () => {
//     if (!auth) {
//       toast.error("Please login first");
//       navigate("/login");
//       return;
//     }

//     try {
//       await addToCart(auth.userId, {
//         productId: product.productId,
//         variantId: selectedVariant.id,
//         quantity: 1,
//       });

//       toast.success("Added to cart");
//       navigate("/cart");
//     } catch (err) {
//       toast.error("Failed to add to cart");
//       console.error(err);
//     }
//   }}
//   className="flex-1 bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition"
// >
//   Add to Cart
// </button>


//             <button className="flex-1 border-2 border-yellow-400 text-yellow-400 font-bold py-3 rounded-xl hover:bg-yellow-400 hover:text-black transition">
//               Buy Now
//             </button>
//           </div>
//         </div>

//         {/* ===================== RIGHT DETAILS ===================== */}
//         <div className="space-y-6 text-white">

//           {/* Title */}
//           <div>
//             <h1 className="text-3xl lg:text-4xl font-bold text-yellow-400">
//               {product.name}
//             </h1>
//             <p className="text-gray-400 mt-1">{product.brandName}</p>
//           </div>

//           {/* Description */}
//           <p className="text-gray-300">{product.description}</p>

//           {/* Price */}
//           {selectedVariant && (
//             <div className="bg-gray-900 p-6 rounded-xl">
//               <div className="text-4xl font-bold text-green-400">
//                 ₹{selectedVariant.price.toLocaleString()}
//               </div>
//               <p
//                 className={`mt-2 font-semibold ${
//                   selectedVariant.stock > 0
//                     ? "text-green-400"
//                     : "text-red-400"
//                 }`}
//               >
//                 {selectedVariant.stock > 0
//                   ? `In Stock (${selectedVariant.stock})`
//                   : "Out of Stock"}
//               </p>
//             </div>
//           )}

//           {/* Variants */}
//           {product.variants?.length > 1 && (
//             <div className="bg-gray-900 p-6 rounded-xl">
//               <h4 className="mb-4 font-semibold">Select Variant</h4>
//               <div className="flex flex-wrap gap-3">
//                 {product.variants.map((v) => (
//                   <button
//                     key={v.id}
//                     onClick={() => setSelectedVariant(v)}
//                     className={`px-4 py-2 rounded-xl border-2 ${
//                       selectedVariant?.id === v.id
//                         ? "border-yellow-400 bg-yellow-400 text-black font-semibold"
//                         : "border-gray-600 hover:border-gray-400"
//                     }`}
//                   >
//                     SKU: {v.sku}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Features */}
//           {product.features?.length > 0 && (
//             <div className="bg-gray-900 p-6 rounded-xl">
//               <h3 className="text-xl font-bold text-yellow-400 mb-3">
//                 Key Features
//               </h3>
//               <ul className="space-y-2 text-gray-300">
//                 {product.features.map((f, i) => (
//                   <li key={i}>✓ {f.feature}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Specifications */}
//           {product.specifications?.length > 0 && (
//             <div className="bg-gray-900 p-6 rounded-xl">
//               <h3 className="text-xl font-bold text-yellow-400 mb-3">
//                 Specifications
//               </h3>
//               {product.specifications.map((s, i) => (
//                 <div
//                   key={i}
//                   className="flex justify-between border-b border-gray-700 py-2 last:border-0"
//                 >
//                   <span className="text-gray-400">{s.specKey}</span>
//                   <span className="font-semibold">{s.specValue}</span>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Manufacturer Info */}
//           {product.manufacturerInfo?.content && (
//             <div className="bg-gray-900 p-6 rounded-xl">
//               <h3 className="text-xl font-bold text-yellow-400 mb-3">
//                 Manufacturer Info
//               </h3>
//               <p className="text-gray-300">
//                 {product.manufacturerInfo.content}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { addToCart } from "../services/CartService";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../services/WishlistService";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // ❤️ Heart icon

export default function ProductPage() {
  const { slug } = useParams();
  const { auth } = useAuth();      
  const navigate = useNavigate(); 

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [hoveredThumb, setHoveredThumb] = useState(null);
  const [wishlist, setWishlist] = useState([]); // Wishlist items
  const [isWished, setIsWished] = useState(false);

  const userId = auth?.userId;

  // Fetch product
  useEffect(() => {
    fetch(`http://localhost:8080/api/products/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        console.log(data);
        if (data.variants?.length > 0) setSelectedVariant(data.variants[0]);
        if (data.images?.length > 0) setMainImage(data.images[0]);
      })
      .catch((err) => console.error("Product fetch error:", err));
  }, [slug]);

  // Fetch wishlist and check if current product is wished
  useEffect(() => {
    if (userId) {
      getWishlist(userId)
        .then((res) => {
          setWishlist(res.data);
          const wished = res.data.some(
            (item) => item.productId === product?.productId
          );
          setIsWished(wished);
        })
        .catch((err) => console.error(err));
    }
  }, [userId, product]);

  const toggleWishlist = async () => {
    if (!auth) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      if (isWished) {
        // Remove from wishlist
        await removeFromWishlist(userId, product.productId);
        toast.success("Removed from wishlist");
        setIsWished(false);
      } else {
        // Add to wishlist
        await addToWishlist(userId, product.productId);
        toast.success("Added to wishlist");
        setIsWished(true);
      }
    } catch (err) {
      toast.error("Wishlist action failed");
      console.error(err);
    }
  };

  if (!product) {
    return <div className="text-center p-10 text-white">Loading...</div>;
  }

  const breadcrumbs = [
    { name: "Home", href: "/" },
    ...(product.breadcrumb?.map((b) => ({ name: b, href: "#" })) || []),
    { name: product.name, href: `/product/${slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Breadcrumb */}
      <nav className="text-gray-400 text-sm mb-4 flex flex-wrap gap-1">
        {breadcrumbs.map((bc, idx) => (
          <span key={idx} className="flex items-center">
            {idx !== breadcrumbs.length - 1 ? (
              <>
                <Link to={bc.href} className="hover:underline">{bc.name}</Link>
                <span className="mx-1">/</span>
              </>
            ) : (
              <span className="text-white font-semibold">{bc.name}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Images */}
        <div className="lg:sticky lg:top-4 bg-gray-900 rounded-xl p-6 relative">
          {/* Wishlist Icon */}
          <button
            onClick={toggleWishlist}
            className="absolute top-4 right-4 text-2xl text-red-500 z-50 hover:scale-110 transition"
          >
            {isWished ? <FaHeart /> : <FaRegHeart />}
          </button>

          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
              {product.images?.map((img, i) => (
                <div
                  key={i}
                  onMouseEnter={() => { setMainImage(img); setHoveredThumb(i); }}
                  onMouseLeave={() => setHoveredThumb(null)}
                  className="relative"
                >
                  <img
                    src={img}
                    alt=""
                    className={`h-16 w-16 object-cover rounded border-2 cursor-pointer ${
                      mainImage === img ? "border-yellow-400" : "border-gray-700 hover:border-gray-500"
                    }`}
                  />
                  {hoveredThumb === i && (
                    <div className="absolute left-20 top-0 z-50 hidden lg:block">
                      <img
                        src={img}
                        alt=""
                        className="h-32 w-32 object-cover rounded-xl border-2 border-yellow-400 bg-gray-900 shadow-xl"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1">
              <img
                src={mainImage}
                alt={product.name}
                className="rounded-xl w-full object-cover hover:scale-105 transition"
              />
            </div>
          </div>

          {/* Add to Cart / Buy Now */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={async () => {
                if (!auth) { toast.error("Please login first"); navigate("/login"); return; }
                try {
                  await addToCart(auth.userId, {
                    productId: product.productId,
                    variantId: selectedVariant.id,
                    quantity: 1,
                  });
                  toast.success("Added to cart");
                  navigate("/cart");
                } catch (err) {
                  toast.error("Failed to add to cart");
                  console.error(err);
                }
              }}
              className="flex-1 bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-500 transition"
            >
              Add to Cart
            </button>

            <button className="flex-1 border-2 border-yellow-400 text-yellow-400 font-bold py-3 rounded-xl hover:bg-yellow-400 hover:text-black transition">
              Buy Now
            </button>
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-6 text-white">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-yellow-400">{product.name}</h1>
            <p className="text-gray-400 mt-1">{product.brandName}</p>
          </div>

          <p className="text-gray-300">{product.description}</p>

          {selectedVariant && (
            <div className="bg-gray-900 p-6 rounded-xl">
              <div className="text-4xl font-bold text-green-400">
                ₹{selectedVariant.price.toLocaleString()}
              </div>
              <p className={`mt-2 font-semibold ${
                selectedVariant.stock > 0 ? "text-green-400" : "text-red-400"
              }`}>
                {selectedVariant.stock > 0 ? `In Stock (${selectedVariant.stock})` : "Out of Stock"}
              </p>
            </div>
          )}

          {product.variants?.length > 1 && (
            <div className="bg-gray-900 p-6 rounded-xl">
              <h4 className="mb-4 font-semibold">Select Variant</h4>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl border-2 ${
                      selectedVariant?.id === v.id ? "border-yellow-400 bg-yellow-400 text-black font-semibold" : "border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    SKU: {v.sku}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.features?.length > 0 && (
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">Key Features</h3>
              <ul className="space-y-2 text-gray-300">
                {product.features.map((f, i) => <li key={i}>✓ {f.feature}</li>)}
              </ul>
            </div>
          )}

          {product.specifications?.length > 0 && (
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">Specifications</h3>
              {product.specifications.map((s, i) => (
                <div key={i} className="flex justify-between border-b border-gray-700 py-2 last:border-0">
                  <span className="text-gray-400">{s.specKey}</span>
                  <span className="font-semibold">{s.specValue}</span>
                </div>
              ))}
            </div>
          )}

          {product.manufacturerInfo?.content && (
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">Manufacturer Info</h3>
              <p className="text-gray-300">{product.manufacturerInfo.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
