// // src/components/wishlist/WishlistController.jsx
// import React, { useEffect, useState } from "react";
// import {
//   addToWishlist,
//   getWishlist,
//   removeFromWishlist,
// } from "../../services/WishlistService";
// import toast from "react-hot-toast";

// const WishlistController = ({ userId }) => {
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch wishlist
//   const fetchWishlist = async () => {
//     try {
//       const res = await getWishlist(userId);
//       setWishlistItems(res.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load wishlist");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add item
//   const handleAdd = async (productId) => {
//     try {
//       await addToWishlist(userId, productId);
//       toast.success("Added to wishlist ❤️");
//       fetchWishlist();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add to wishlist");
//     }
//   };

//   // Remove item
//   const handleRemove = async (productId) => {
//     try {
//       await removeFromWishlist(userId, productId);
//       toast.success("Removed from wishlist 💔");
//       fetchWishlist();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to remove from wishlist");
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     if (userId) fetchWishlist();
//   }, [userId]);

//   if (loading) {
//     return <div className="text-white p-6">Loading wishlist...</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 text-white">
//       <h1 className="text-3xl font-bold text-yellow-400 mb-6">
//         Your Wishlist ({wishlistItems.length})
//       </h1>

//       {wishlistItems.length === 0 ? (
//         <p className="text-gray-400 text-center mt-10">Wishlist is empty 💔</p>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {wishlistItems.map((item) => (
//             <div
//               key={item.productId}
//               className="flex flex-col gap-2 bg-gray-900 p-4 rounded-xl"
//             >
//               <img
//                 src={item.productImage}
//                 alt={item.productName}
//                 className="h-48 w-full object-cover rounded-lg"
//               />
//               <h3 className="font-bold text-lg">{item.productName}</h3>
//               <p className="text-green-400 font-semibold">
//                 ₹{item.price?.toLocaleString() || "N/A"}
//               </p>

//               <div className="flex gap-3 mt-2">
//                 <button
//                   onClick={() => handleRemove(item.productId)}
//                   className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
//                 >
//                   Remove
//                 </button>
//                 {/* Optional: Add to cart button */}
//                 <button
//                   onClick={() => toast("Use product page to add to cart")}
//                   className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default WishlistController;


import React, { useEffect, useState } from "react";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../../services/WishlistService";
import toast from "react-hot-toast";

const WishlistController = ({ userId }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH WISHLIST ================= */
  const fetchWishlist = async () => {
    try {
      const res = await getWishlist(userId);
      setWishlistItems(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD ================= */
  const handleAdd = async (productId) => {
    try {
      await addToWishlist(userId, productId);
      toast.success("Added to wishlist ❤️");
      fetchWishlist();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to wishlist");
    }
  };

  /* ================= REMOVE ================= */
  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(userId, productId);
      toast.success("Removed from wishlist 💔");
      fetchWishlist();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove from wishlist");
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    if (userId) fetchWishlist();
  }, [userId]);

  if (loading) {
    return <div className="p-6 text-white">Loading wishlist...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Your Wishlist ({wishlistItems.length})
      </h1>

      {wishlistItems.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          Wishlist is empty 💔
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.productId}
              className="bg-gray-900 p-4 rounded-xl flex flex-col gap-3"
            >
              <img
                src={item.productImage || "/placeholder.png"}
                alt={item.productName}
                className="h-48 w-full object-cover rounded-lg"
              />

              <h3 className="font-bold text-lg">{item.productName}</h3>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="bg-red-600 px-3 py-2 rounded hover:bg-red-700 flex-1"
                >
                  Remove
                </button>

                <button
                  onClick={() =>
                    toast("Open product page to add to cart")
                  }
                  className="bg-yellow-400 text-black px-3 py-2 rounded hover:bg-yellow-500 flex-1"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistController;

