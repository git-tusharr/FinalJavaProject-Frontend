// import { useEffect, useState } from "react";
// import { checkoutUser } from "../services/CheckoutService";
// import { useAuth } from "../api/AuthContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function CheckoutPage() {
//   const { auth } = useAuth();
//   const userId = auth?.userId;
//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!auth) {
//       toast.error("Please login first");
//       navigate("/login");
//       return;
//     }

//     const placeOrder = async () => {
//       try {
//         const res = await checkoutUser(userId);
//         setOrders(res.data);
//         toast.success("Order placed successfully 🎉");
//       } catch (err) {
//         setError("Checkout failed");
//         toast.error("Checkout failed");
//       } finally {
//         setLoading(false);
//       }
//     };

//     placeOrder();
//   }, [auth, userId, navigate]);

//   if (loading) {
//     return <div className="p-10 text-white text-center">Placing your order...</div>;
//   }

//   if (error) {
//     return <div className="p-10 text-red-400 text-center">{error}</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 text-white">
//       <h1 className="text-3xl font-bold text-green-400 mb-6">
//         Order Successful ✅
//       </h1>

//       <table className="w-full border border-gray-700 rounded-xl overflow-hidden">
//         <thead className="bg-gray-800">
//           <tr>
//             <th className="p-3 text-left">Product ID</th>
//             <th className="p-3 text-left">Quantity</th>
//             <th className="p-3 text-left">Price</th>
//             <th className="p-3 text-left">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((o) => (
//             <tr key={o.id} className="border-t border-gray-700">
//               <td className="p-3">{o.productId}</td>
//               <td className="p-3">{o.quantity}</td>
//               <td className="p-3 text-green-400">₹{o.price}</td>
//               <td className="p-3 text-yellow-400">{o.orderStatus}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <button
//         onClick={() => navigate("/orders")}
//         className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
//       >
//         View Orders
//       </button>
//     </div>
//   );



// import { useEffect, useRef, useState } from "react";
// import { useAuth } from "../api/AuthContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import API from "../api/axiosInstance";
// import { getCart } from "../services/CartService";

// export default function CheckoutPage() {
//   const { auth } = useAuth();
//   const userId = auth?.userId;
//   const navigate = useNavigate();

//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const pollingRef = useRef(null);

//   /* ================= AUTH GUARD ================= */
//   useEffect(() => {
//     if (auth === null) return;

//     if (!auth) {
//       toast.error("Please login first");
//       navigate("/login");
//     }
//   }, [auth, navigate]);

//   /* ================= LOAD CART (FIXED) ================= */
//   const loadCart = async () => {
//     try {
//       const res = await getCart(userId); // ✅ /api/cart/get/{userId}
//       setCartItems(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       toast.error("Failed to load cart");
//       setCartItems([]);
//     }
//   };

//   useEffect(() => {
//     if (userId) loadCart();
//   }, [userId]);

//   /* ================= TOTAL ================= */
//   const subtotal = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   const shipping = subtotal > 5000 ? 0 : 99;
//   const total = subtotal + shipping;

//   /* ================= PAY NOW ================= */
//   const payNow = async () => {
//     if (cartItems.length === 0) {
//       toast.error("Cart is empty");
//       return;
//     }

//     if (total <= 0) {
//       toast.error("Invalid payment amount");
//       return;
//     }

//     // Razorpay max safeguard
//     if (total > 500000) {
//       toast.error("Maximum payment allowed is ₹5,00,000");
//       return;
//     }

//     if (!window.Razorpay) {
//       toast.error("Payment service unavailable");
//       return;
//     }

//     try {
//       setLoading(true);

//       // ✅ Backend expects userId + amount
//       const res = await API.post("/payment/create-order", {
//         userId,
//         amount: total,
//       });

//       const { orderId, key } = res.data;

//       const options = {
//         key,
//         order_id: orderId,
//         currency: "INR",
//         name: "My Store",
//         description: "Order Payment",

//         prefill: {
//           name: auth?.name || "User",
//           email: auth?.email || "test@test.com",
//           contact: auth?.phone || "9999999999",
//         },

//         handler: function () {
//           toast.success("Payment successful! Verifying...");
//           checkOrderStatus(orderId);
//         },

//         modal: {
//           ondismiss: function () {
//             toast.error("Payment cancelled");
//           },
//         },

//         theme: {
//           color: "#FACC15",
//         },
//       };

//       const rzp = new window.Razorpay(options);

//       rzp.on("payment.failed", function (res) {
//         toast.error(res?.error?.description || "Payment failed");
//       });

//       rzp.open();
//     } catch (err) {
//       console.error(err);
//       toast.error("Payment initiation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= ORDER STATUS POLLING ================= */
//  const checkOrderStatus = (orderId) => {
//   let attempts = 0;

//   pollingRef.current = setInterval(async () => {
//     attempts++;

//     try {
//       const res = await API.get(`/payment/status/order/${orderId}`);

//       if (res.data === "PAID") {
//         clearInterval(pollingRef.current);
//         toast.success("Order confirmed 🎉");

//         // Redirect to Orders page after payment confirmation
//         navigate("/orders");
//       }
//     } catch (err) {
//       console.error("Status check failed", err);
//     }

//     if (attempts >= 10) {
//       clearInterval(pollingRef.current);
//       toast("Order pending. Please check later.");
//     }
//   }, 2000);
// };


//   /* ================= CLEANUP ================= */
//   useEffect(() => {
//     return () => {
//       if (pollingRef.current) {
//         clearInterval(pollingRef.current);
//       }
//     };
//   }, []);

//   /* ================= UI ================= */
//   return (
//     <div className="max-w-4xl mx-auto p-6 text-white">
//       <h1 className="text-3xl font-bold text-yellow-400 mb-6">
//         Checkout
//       </h1>

//       {cartItems.length === 0 ? (
//         <p className="text-gray-400">Your cart is empty.</p>
//       ) : (
//         <>
//           <div className="space-y-4">
//             {cartItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex justify-between bg-gray-900 p-4 rounded-xl"
//               >
//                 <div>
//                   <h3 className="font-bold">{item.productName}</h3>
//                   <p className="text-gray-400">
//                     Qty: {item.quantity}
//                   </p>
//                 </div>
//                 <p className="text-green-400 font-bold">
//                   ₹{item.price * item.quantity}
//                 </p>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6 space-y-2 text-lg">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>₹{subtotal}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Shipping</span>
//               <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
//             </div>
//             <hr className="border-gray-700" />
//             <div className="flex justify-between text-xl font-bold">
//               <span>Total</span>
//               <span className="text-green-400">₹{total}</span>
//             </div>
//           </div>

//           <button
//             onClick={payNow}
//             disabled={loading}
//             className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-500 disabled:opacity-60"
//           >
//             {loading ? "Processing..." : "Pay Now"}
//           </button>
//         </>
//       )}
//     </div>
//   );
// }








import { useEffect, useRef, useState } from "react";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axiosInstance";
import { getCart } from "../services/CartService";

export default function CheckoutPage() {
  const { auth } = useAuth();
  const userId = auth?.userId;
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const pollingRef = useRef(null);

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (auth === null) return;

    if (!auth) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [auth, navigate]);

  /* ================= LOAD CART ================= */
  const loadCart = async () => {
    try {
      const res = await getCart(userId); // ✅ /api/cart/get/{userId}
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load cart");
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (userId) loadCart();
  }, [userId]);

  /* ================= TOTAL ================= */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 5000 ? 0 : 99;
  const total = subtotal + shipping;

  /* ================= PAY NOW ================= */
  const payNow = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (total <= 0) {
      toast.error("Invalid payment amount");
      return;
    }

    // Razorpay max safeguard
    if (total > 500000) {
      toast.error("Maximum payment allowed is ₹5,00,000");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment service unavailable");
      return;
    }

    try {
      setLoading(true);

      // ✅ Backend expects userId + amount
      const res = await API.post("/payment/create-order", {
        userId,
        amount: total,
      });

      const { orderId, key } = res.data;

      const options = {
        key,
        order_id: orderId,
        currency: "INR",
        name: "My Store",
        description: "Order Payment",

        prefill: {
          name: auth?.name || "User",
          email: auth?.email || "test@test.com",
          contact: auth?.phone || "9999999999",
        },

        handler: function () {
          toast.success("Payment successful! Verifying...");
          checkOrderStatus(orderId);
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },

        theme: {
          color: "#FACC15",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (res) {
        toast.error(res?.error?.description || "Payment failed");
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ORDER STATUS POLLING ================= */
  const checkOrderStatus = async (orderId) => {
    let attempts = 0;

    pollingRef.current = setInterval(async () => {
      attempts++;

      try {
        const res = await API.get(`/payment/status/order/${orderId}`);

        if (res.data === "PAID") {
          clearInterval(pollingRef.current);
          toast.success("Order confirmed 🎉 Redirecting...");
          setTimeout(() => navigate("/orders"), 1500);
        }
      } catch (err) {
        console.error("Status check failed", err);
      }

      if (attempts >= 10) {
        clearInterval(pollingRef.current);
        toast("Order pending. Please check later.");
      }
    }, 2000);
  };

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  /* ================= UI ================= */
  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Checkout
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between bg-gray-900 p-4 rounded-xl"
              >
                <div>
                  <h3 className="font-bold">{item.productName}</h3>
                  <p className="text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-green-400 font-bold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>
            <hr className="border-gray-700" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-green-400">₹{total}</span>
            </div>
          </div>

          <button
            onClick={payNow}
            disabled={loading}
            className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-500 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </>
      )}
    </div>
  );
}
