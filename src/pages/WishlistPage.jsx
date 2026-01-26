// // src/pages/WishlistPage.jsx
// import { useEffect, useState } from "react";
// import { useAuth } from "../api/AuthContext";
// import { getWishlist, removeFromWishlist } from "../services/WishlistService";
// import { addToCart } from "../services/CartService";
// import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function WishlistPage() {
//   const { auth } = useAuth();
//   const navigate = useNavigate();
//   const userId = auth?.userId;

//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= LOAD WISHLIST ================= */
//   const loadWishlist = async () => {
//     try {
//       const res = await getWishlist(userId);
//       setItems(res.data || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load wishlist");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= REMOVE ================= */
//   const handleRemove = async (productId) => {
//     try {
//       await removeFromWishlist(userId, productId);
//       toast.success("Removed from wishlist");
//       setItems((prev) =>
//         prev.filter((item) => item.productId !== productId)
//       );
//     } catch (err) {
//       toast.error("Failed to remove item");
//     }
//   };

//   /* ================= ADD TO CART ================= */
//   const handleAddToCart = async (item) => {
//     try {
//       await addToCart(userId, {
//         productId: item.productId,
//         quantity: 1,
//       });
//       toast.success("Added to cart");
//       navigate("/cart");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add to cart");
//     }
//   };

//   /* ================= AUTH CHECK ================= */
//   useEffect(() => {
//     if (!auth) {
//       toast.error("Please login first");
//       navigate("/login");
//     } else {
//       loadWishlist();
//     }
//   }, [auth]);

//   /* ================= UI STATES ================= */
//   if (loading) {
//     return (
//       <div className="p-10 text-center text-white">
//         Loading wishlist...
//       </div>
//     );
//   }

//   if (items.length === 0) {
//     return (
//       <div className="p-12 text-center text-gray-400">
//         <p className="text-lg mb-4">Your wishlist is empty 🤍</p>
//         <Link
//           to="/shop"
//           className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500"
//         >
//           Continue Shopping
//         </Link>
//       </div>
//     );
//   }

//   /* ================= MAIN UI ================= */
//   return (
//     <div className="max-w-7xl mx-auto p-6 text-white">
//       <h1 className="text-3xl font-bold text-yellow-400 mb-6">
//         My Wishlist
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {items.map((item) => (
//           <div
//             key={item.wishlistId}
//             className="bg-gray-900 rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition"
//           >
//             {/* IMAGE */}
//             <Link to={`/product/${item.productId}`}>
//               <img
//                 src={item.imageUrl}
//                 alt={item.productName}
//                 className="h-56 w-full object-cover"
//               />
//             </Link>

//             {/* DETAILS */}
//             <div className="p-4 flex flex-col flex-1">
//               <h3 className="text-lg font-bold hover:text-yellow-400">
//                 {item.productName}
//               </h3>

//               {/* ACTIONS */}
//               <div className="mt-auto flex gap-2 pt-4">
//                 <button
//                   onClick={() => handleAddToCart(item)}
//                   className="flex-1 py-2 rounded-xl font-semibold bg-yellow-400 text-black hover:bg-yellow-500"
//                 >
//                   Add to Cart
//                 </button>

//                 <button
//                   onClick={() => handleRemove(item.productId)}
//                   className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-xl font-semibold"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useWishlistController from "../controllers/WishlistController";
import { useAuth } from "../api/AuthContext";

const toSlug = (text) =>
  text
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function WishlistPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const userId = auth?.userId;
  const { wishlist, loading, removeItem } =
    useWishlistController(userId);

  if (!userId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        Please login to view your wishlist
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        Loading wishlist...
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400">
        <img
          src="/empty-wishlist.svg"
          alt="Empty wishlist"
          className="w-48 mb-4 opacity-80"
        />
        <p className="text-lg">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-white mb-6">
        My Wishlist ❤️
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const slug = toSlug(item.productName);

          return (
            <div
              key={item.id}
              className="group relative bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition"
            >
              {/* Remove */}
              <button
                onClick={() => removeItem(item.productId)}
                className="absolute top-3 right-3 z-10 bg-black/70 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>

              {/* Image */}
              <div
                onClick={() => navigate(`/product/${slug}`)}
                className="cursor-pointer bg-black flex items-center justify-center h-56 overflow-hidden"
              >
                <img
                  src={item.imageUrl || "/placeholder.png"}
                  alt={item.productName}
                  className="h-40 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <h2 className="text-white text-sm font-medium line-clamp-2 mb-3">
                  {item.productName}
                </h2>

                <button
                  onClick={() => navigate(`/product/${slug}`)}
                  className="w-full text-sm py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition"
                >
                  View Product
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
