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
// }







// import { useEffect, useState } from "react";
// import { checkoutUser } from "../services/CheckoutService";
// import { createPaymentOrder } from "../services/PaymentService";
// import { useAuth } from "../api/AuthContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function CheckoutPage() {
//   const { auth } = useAuth();
//   const userId = auth?.userId;
//   const navigate = useNavigate();

//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [processingPayment, setProcessingPayment] = useState(false);

//   // Calculate total amount
//   const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//   useEffect(() => {
//     if (!auth) {
//       toast.error("Please login first");
//       navigate("/login");
//       return;
//     }

//     // Load cart items for preview
//     const loadCart = async () => {
//       try {
//         // You'll need an API to fetch current cart items
//         // For now, using checkoutUser to get items
//         const res = await checkoutUser(userId);
//         setCartItems(res.data);
//       } catch (err) {
//         setError("Failed to load cart");
//         toast.error("Failed to load cart");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCart();
//   }, [auth, userId, navigate]);

//   const handlePayment = async () => {
//     if (cartItems.length === 0) {
//       toast.error("Cart is empty");
//       return;
//     }

//     setProcessingPayment(true);

//     try {
//       // Step 1: Create Razorpay order
//       const orderResponse = await createPaymentOrder({
//         amount: totalAmount * 100, // Convert to paise
//         userId: userId
//       });

//       const { orderId, key } = orderResponse.data;

//       // Step 2: Initialize Razorpay
//       const options = {
//         key: key,
//         amount: totalAmount * 100,
//         currency: "INR",
//         name: "Your Store Name",
//         description: "Order Payment",
//         order_id: orderId,
//         handler: async function (response) {
//           // Payment successful
//           toast.success("Payment successful! 🎉");
          
//           // The webhook will handle backend updates
//           // Navigate to orders page after a short delay
//           setTimeout(() => {
//             navigate("/orders");
//           }, 1500);
//         },
//         prefill: {
//           name: auth.username || "",
//           email: auth.email || "",
//           contact: auth.phone || ""
//         },
//         notes: {
//           userId: userId
//         },
//         theme: {
//           color: "#FBBF24" // Yellow color matching your theme
//         },
//         modal: {
//           ondismiss: function() {
//             setProcessingPayment(false);
//             toast.error("Payment cancelled");
//           }
//         }
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
      
//     } catch (err) {
//       console.error("Payment error:", err);
//       toast.error("Payment initialization failed");
//       setProcessingPayment(false);
//     }
//   };

//   if (loading) {
//     return <div className="p-10 text-white text-center">Loading checkout...</div>;
//   }

//   if (error) {
//     return <div className="p-10 text-red-400 text-center">{error}</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 text-white">
//       <h1 className="text-3xl font-bold text-yellow-400 mb-6">
//         Checkout
//       </h1>

//       {cartItems.length === 0 ? (
//         <div className="text-center">
//           <p className="text-gray-400 mb-4">Your cart is empty</p>
//           <button
//             onClick={() => navigate("/")}
//             className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className="bg-gray-800 rounded-xl p-6 mb-6">
//             <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
//             <table className="w-full border border-gray-700 rounded-xl overflow-hidden mb-6">
//               <thead className="bg-gray-700">
//                 <tr>
//                   <th className="p-3 text-left">Product</th>
//                   <th className="p-3 text-left">Quantity</th>
//                   <th className="p-3 text-left">Price</th>
//                   <th className="p-3 text-left">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cartItems.map((item) => (
//                   <tr key={item.id} className="border-t border-gray-700">
//                     <td className="p-3">{item.productId}</td>
//                     <td className="p-3">{item.quantity}</td>
//                     <td className="p-3 text-green-400">₹{item.price}</td>
//                     <td className="p-3 text-green-400">₹{item.price * item.quantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="border-t border-gray-700 pt-4">
//               <div className="flex justify-between text-xl font-bold">
//                 <span>Total Amount:</span>
//                 <span className="text-green-400">₹{totalAmount}</span>
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <button
//               onClick={() => navigate("/cart")}
//               className="bg-gray-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600"
//             >
//               Back to Cart
//             </button>
            
//             <button
//               onClick={handlePayment}
//               disabled={processingPayment}
//               className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
//             >
//               {processingPayment ? "Processing..." : `Pay ₹${totalAmount}`}
//             </button>
//           </div>

//           {/* Important: Add Razorpay script to your index.html */}
//           <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
//             <p className="text-sm text-blue-300">
//               💡 <strong>Secure Payment:</strong> Your payment is processed securely through Razorpay
//             </p>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { checkoutUser } from "../services/CheckoutService";
import { createPaymentOrder } from "../services/PaymentService";
import { useAuth } from "../api/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { auth } = useAuth();
  const userId = auth?.userId;
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Calculate total amount
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    // ✅ DEBUG: Check authentication status
    console.log("=== AUTHENTICATION DEBUG ===");
    console.log("Auth object:", auth);
    console.log("User ID:", userId);
    console.log("Token from localStorage:", localStorage.getItem("token"));
    console.log("Token from sessionStorage:", sessionStorage.getItem("token"));
    console.log("===========================");

    if (!auth) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    // Load cart items for preview
    const loadCart = async () => {
      try {
        // You'll need an API to fetch current cart items
        // For now, using checkoutUser to get items
        const res = await checkoutUser(userId);
        setCartItems(res.data);
      } catch (err) {
        setError("Failed to load cart");
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [auth, userId, navigate]);

  const handlePayment = async () => {
    // ✅ PRE-FLIGHT CHECKS
    console.log("=== PAYMENT PRE-FLIGHT CHECKS ===");
    console.log("1. Auth object exists:", !!auth);
    console.log("2. User ID:", userId);
    console.log("3. Cart items count:", cartItems.length);
    console.log("4. Total amount:", totalAmount);
    console.log("5. Token in localStorage:", localStorage.getItem("token") ? "EXISTS" : "MISSING");
    console.log("6. Token value:", localStorage.getItem("token")?.substring(0, 20) + "...");
    console.log("================================");

    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (!auth || !userId) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    setProcessingPayment(true);

    try {
      console.log("📤 Creating payment order...");
      
      const payload = {
        amount: totalAmount * 100, // Convert to paise
        userId: userId
      };
      
      console.log("Payment payload:", payload);

      // Step 1: Create Razorpay order
      const orderResponse = await createPaymentOrder(payload);

      console.log("✅ Order created successfully:", orderResponse.data);

      const { orderId, key } = orderResponse.data;

      // Step 2: Initialize Razorpay
      const options = {
        key: key,
        amount: totalAmount * 100,
        currency: "INR",
        name: "Your Store Name",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          console.log("✅ Payment successful:", response);
          toast.success("Payment successful! 🎉");
          
          // The webhook will handle backend updates
          // Navigate to orders page after a short delay
          setTimeout(() => {
            navigate("/orders");
          }, 1500);
        },
        prefill: {
          name: auth.username || "",
          email: auth.email || "",
          contact: auth.phone || ""
        },
        notes: {
          userId: userId
        },
        theme: {
          color: "#FBBF24" // Yellow color matching your theme
        },
        modal: {
          ondismiss: function() {
            console.log("⚠️ Payment modal dismissed");
            setProcessingPayment(false);
            toast.error("Payment cancelled");
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (err) {
      console.error("❌ Payment error:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      console.error("Error headers:", err.response?.headers);
      
      // Check specific error
      if (err.response?.status === 403) {
        toast.error("Authentication failed. Please login again.");
        console.error("🔴 403 ERROR - Possible causes:");
        console.error("1. Token is missing");
        console.error("2. Token is expired");
        console.error("3. Token is invalid");
        console.error("4. Backend security config blocks request");
        
        // Try to get more info
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ NO TOKEN FOUND in localStorage");
          navigate("/login");
        } else {
          console.error("Token exists but was rejected by backend");
          console.error("Token preview:", token.substring(0, 50) + "...");
        }
      } else if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error("Payment initialization failed");
      }
      
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-white text-center">Loading checkout...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-400 text-center">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Checkout
      </h1>

      {/* DEBUG INFO PANEL */}
      <div className="bg-blue-900/30 rounded-lg p-4 mb-6 text-sm">
        <h3 className="font-bold text-blue-300 mb-2">🔍 Debug Info:</h3>
        <div className="space-y-1 text-blue-200">
          <p>Logged in: {auth ? "✅ Yes" : "❌ No"}</p>
          <p>User ID: {userId || "N/A"}</p>
          <p>Token exists: {localStorage.getItem("token") ? "✅ Yes" : "❌ No"}</p>
          <p>Cart items: {cartItems.length}</p>
          <p>Total: ₹{totalAmount}</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-400 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <table className="w-full border border-gray-700 rounded-xl overflow-hidden mb-6">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-700">
                    <td className="p-3">{item.productId}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3 text-green-400">₹{item.price}</td>
                    <td className="p-3 text-green-400">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-green-400">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="bg-gray-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600"
            >
              Back to Cart
            </button>
            
            <button
              onClick={handlePayment}
              disabled={processingPayment}
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {processingPayment ? "Processing..." : `Pay ₹${totalAmount}`}
            </button>
          </div>

          {/* Important: Add Razorpay script to your index.html */}
          <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-300">
              💡 <strong>Secure Payment:</strong> Your payment is processed securely through Razorpay
            </p>
          </div>
        </>
      )}
    </div>
  );
}