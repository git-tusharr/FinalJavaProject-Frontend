import { useEffect, useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../api/axiosInstance";

/* ── THEME TOKENS ── */
const T = {
  black: "#080808",
  surface: "#111111",
  card: "#141414",
  border: "#1e1e1e",
  gold: "#E9B949",
  goldHov: "#f5c84e",
  red: "#D0312D",
  text: "#e2e2e2",
  muted: "#666666",
  green: "#4ade80",
};

const SYNE = "'Syne', sans-serif";
const DM = "'DM Sans', sans-serif";

export default function Checkout() {
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadCart(); }, []);

  const loadCart = async () => {
    try {
      const res = await API.get(`/checkout/${userId}`);
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setCartItems([]);
    }
  };

  const total = cartItems.reduce(
    (sum, c) => sum + c.price * c.quantity,
    0
  );

  /* ── REMOVE ITEM (same API as cart) ── */
  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/remove/${id}`);
      loadCart();
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  /* ── ONE TIME PAYMENT ── */
  const payNow = async () => {
    try {
      setLoading(true);

      await API.post(`/checkout/${userId}`);

      const amountPaise = Math.round(total * 100);

      const res = await API.post("/payment/create-order", {
        amount: amountPaise,
        userId
      });

      const { orderId, key } = res.data;

      const options = {
        key,
        amount: amountPaise,
        currency: "INR",
        name: "My Store",
        order_id: orderId,
        handler: function (response) {
          const razorpayOrderId = response.razorpay_order_id;
          const razorpayPaymentId = response.razorpay_payment_id;

          API.post("/payment/order-paid", {
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
          })
            .then(() => {
              alert("Payment submitted! Checking status...");
              checkOrderStatus(razorpayOrderId);
            })
            .catch(() => {
              alert("Payment done but order update failed.");
            });
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (res) => {
        alert("Payment Failed: " + res.error.description);
      });
      rzp.open();

    } catch {
      alert("Payment setup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ── SUBSCRIPTION ── */
  const subscribeNow = async () => {
    try {
      const res = await API.post("/payment/create-subscription", { userId });

      const { subscriptionId, key } = res.data;

      const options = {
        key,
        subscription_id: subscriptionId,
        name: "My Store Subscription",
        handler: function (response) {
          const subId = response.razorpay_subscription_id;
          alert("Subscription created! Checking status...");
          checkSubscriptionStatus(subId);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch {
      alert("Subscription failed");
    }
  };

  /* ── ORDER STATUS POLLING ── */
  const checkOrderStatus = async (orderId) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await API.get(`/payment/status/order/${orderId}`);
        if (res.data === "PAID") {
          clearInterval(interval);
          alert("Payment Confirmed! Your order has been placed.");
          setCartItems([]);
        }
      } catch {}
      if (attempts >= 10) {
        clearInterval(interval);
        alert("Still pending. Please check later.");
      }
    }, 2000);
  };

  /* ── SUBSCRIPTION STATUS ── */
  const checkSubscriptionStatus = async (subId) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await API.get(`/payment/status/subscription/${subId}`);
        if (res.data === "ACTIVE") {
          clearInterval(interval);
          alert("Subscription Active!");
        }
      } catch {}
      if (attempts >= 10) {
        clearInterval(interval);
        alert("Still pending.");
      }
    }, 2000);
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: T.black,
      px: { xs: 2, md: 4 },
      py: 4,
      fontFamily: DM
    }}>

      {/* Header */}
      <Typography sx={{
        fontFamily: SYNE,
        fontSize: 26,
        fontWeight: 800,
        color: "#fff",
        mb: 3
      }}>
        Check<Box component="span" sx={{ color: T.gold }}>out</Box>
      </Typography>

      {/* Main Card */}
      <Box sx={{
        maxWidth: 700,
        mx: "auto",
        bgcolor: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "12px",
        p: 3
      }}>

        {cartItems.length === 0 ? (
          <Typography sx={{ color: T.muted }}>
            No items in cart.
          </Typography>
        ) : (
          <>
            {cartItems.map((item, i) => (
              <Box key={item.id} sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                py: 2,
                borderBottom:
                  i !== cartItems.length - 1
                    ? `1px solid ${T.border}`
                    : "none"
              }}>

                {/* Image */}
                <Box
                  component="img"
                  src={item.productImage}
                  alt={item.productName}
                  sx={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: "8px",
                    bgcolor: T.card,
                    border: `1px solid ${T.border}`
                  }}
                />

                {/* Info */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{
                    fontFamily: SYNE,
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#fff"
                  }}>
                    {item.productName}
                  </Typography>

                  <Typography sx={{
                    fontSize: 12,
                    color: T.muted
                  }}>
                    Qty: {item.quantity}
                  </Typography>

                  <Typography sx={{
                    fontSize: 13,
                    color: T.gold,
                    fontWeight: 600
                  }}>
                    ₹{item.price}
                  </Typography>
                </Box>

                {/* Remove */}
                <IconButton
                  onClick={() => removeItem(item.id)}
                  sx={{
                    color: T.red,
                    border: "1px solid rgba(208,49,45,.2)",
                    bgcolor: "rgba(208,49,45,.05)",
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: "rgba(208,49,45,.1)"
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>

              </Box>
            ))}

            {/* Divider */}
            <Box sx={{ height: 1, bgcolor: T.border, my: 2 }} />

            {/* Total */}
            <Typography sx={{
              fontFamily: SYNE,
              fontSize: 18,
              fontWeight: 800,
              color: "#fff"
            }}>
              Total: <Box component="span" sx={{ color: T.gold }}>₹{total}</Box>
            </Typography>

            {/* Buttons */}
            <Box mt={3} display="flex" gap={2} flexWrap="wrap">

              {/* Pay */}
              <Button
                onClick={payNow}
                disabled={loading}
                sx={{
                  bgcolor: loading ? T.border : T.gold,
                  color: loading ? T.muted : "#000",
                  fontFamily: SYNE,
                  fontWeight: 700,
                  borderRadius: "8px",
                  px: 3.5,
                  py: 1.5,
                  textTransform: "uppercase",
                  letterSpacing: ".8px",
                  "&:hover": !loading && {
                    bgcolor: T.goldHov,
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 28px rgba(233,185,73,.35)"
                  }
                }}
              >
                {loading ? "Processing..." : "Pay One Time"}
              </Button>

              {/* Subscribe */}
              <Button
                onClick={subscribeNow}
                sx={{
                  border: `1.5px solid ${T.border}`,
                  color: T.text,
                  fontFamily: SYNE,
                  fontWeight: 700,
                  borderRadius: "8px",
                  px: 3,
                  py: 1.5,
                  textTransform: "uppercase",
                  letterSpacing: ".8px",
                  "&:hover": {
                    borderColor: T.gold,
                    color: T.gold,
                    bgcolor: "rgba(233,185,73,.05)"
                  }
                }}
              >
                Subscribe Monthly
              </Button>

            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}