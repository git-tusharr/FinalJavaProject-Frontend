import { useEffect, useState } from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import API from "../api/axiosInstance";

export default function Checkout() {
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadCart(); }, []);

  const loadCart = async () => {
    try {
      const res = await API.get(`/checkout/${userId}`);
      console.log("Cart loaded:", res.data);
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Cart load failed:", err);
      setCartItems([]);
    }
  };

  const total = cartItems.reduce((sum, c) => sum + c.price * c.quantity, 0);

  // 1️⃣ ONE TIME PAYMENT
  const payNow = async () => {
    try {
      setLoading(true);

      // ✅ FIX 1: Persist OrderItems to DB BEFORE payment opens
      await API.post(`/checkout/${userId}`);

      const amountPaise = Math.round(total * 100);
      console.log("Sending amount:", amountPaise);

      const res = await API.post("/payment/create-order", {
        amount: amountPaise,
        userId
      });

      console.log("Order created:", res.data);
      const { orderId, key } = res.data;

      const options = {
        key,
        amount: amountPaise,
        currency: "INR",
        name: "My Store",
        order_id: orderId,
        prefill: {
          name: "Test User",
          email: "test@test.com",
          contact: "9999999999",
        },
        handler: function (response) {
          console.log("Payment callback:", response);

          const razorpayOrderId = response.razorpay_order_id;
          const razorpayPaymentId = response.razorpay_payment_id; // ✅ FIX 2: capture paymentId

          // ✅ FIX 3: Call order-paid so backend marks PAID and creates Order
          API.post("/payment/order-paid", {
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
          })
            .then(() => {
              console.log("order-paid called successfully");
              alert("Payment submitted! Checking status...");
              checkOrderStatus(razorpayOrderId);
            })
            .catch((err) => {
              console.error("order-paid call failed:", err);
              alert("Payment done but order update failed. Contact support.");
            });
        },
        modal: {
          ondismiss: function () {
            console.warn("Popup closed by user");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (res) => {
        console.error("Payment failed:", res.error);
        alert("Payment Failed: " + res.error.description);
      });
      rzp.open();

    } catch (e) {
      console.error("Order creation failed:", e);
      alert("Payment setup failed");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ SUBSCRIPTION PAYMENT
  const subscribeNow = async () => {
    try {
      const res = await API.post("/payment/create-subscription", { userId });
      console.log("Subscription created:", res.data);

      const { subscriptionId, key } = res.data;

      const options = {
        key,
        subscription_id: subscriptionId,
        name: "My Store Subscription",
        handler: function (response) {
          console.log("Subscription callback:", response);
          const subId = response.razorpay_subscription_id;
          alert("Subscription created! Checking status...");
          checkSubscriptionStatus(subId);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Subscription failed:", err);
      alert("Subscription failed");
    }
  };

  // ✅ Polls until order status becomes PAID
  const checkOrderStatus = async (orderId) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      console.log(`Polling order status (${attempts}/10)...`);
      try {
        const res = await API.get(`/payment/status/order/${orderId}`);
        console.log("Order status:", res.data);
        if (res.data === "PAID") {
          clearInterval(interval);
          alert("Payment Confirmed! Your order has been placed.");
          setCartItems([]); // ✅ Clear cart UI
        }
      } catch (err) {
        console.error("Status check error:", err);
      }
      if (attempts >= 10) {
        clearInterval(interval);
        alert("Still pending. Please check My Orders in a moment.");
      }
    }, 2000);
  };

  const checkSubscriptionStatus = async (subId) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      console.log(`Polling subscription status (${attempts}/10)...`);
      try {
        const res = await API.get(`/payment/status/subscription/${subId}`);
        console.log("Subscription status:", res.data);
        if (res.data === "ACTIVE") {
          clearInterval(interval);
          alert("Subscription Active!");
        }
      } catch (err) {
        console.error("Status check error:", err);
      }
      if (attempts >= 10) {
        clearInterval(interval);
        alert("Still pending. Try again later.");
      }
    }, 2000);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>

      {cartItems.length === 0 ? (
        <Typography>No items in cart.</Typography>
      ) : (
        <>
          {cartItems.map((item) => (
            <Box key={item.id} sx={{ mb: 2 }}>
              <Typography>{item.productName}</Typography>
              <Typography>Qty: {item.quantity}</Typography>
              <Typography>Price: ₹{item.price}</Typography>

              {/* ✅ Product Image */}
              <Box
                component="img"
                src={item.productImage}
                alt={item.productName}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 1,
                  border: "1px solid #ddd",
                }}
              />
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}

          <Typography variant="h6">Total: ₹{total}</Typography>

          <Button
            sx={{ mt: 2 }}
            variant="contained"
            disabled={loading}
            onClick={payNow}
          >
            {loading ? "Processing..." : "Pay One Time"}
          </Button>

          <Button
            sx={{ mt: 2, ml: 2 }}
            variant="outlined"
            onClick={subscribeNow}
          >
            Subscribe Monthly
          </Button>
        </>
      )}
    </Box>
  );
}