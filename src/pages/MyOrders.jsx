import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

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

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await API.get(`/orders/user/${userId}`);

      const parsedOrders = res.data.map(order => {
        let items = [];

        if (order.itemsJson) {
          try {
            items =
              typeof order.itemsJson === "string"
                ? JSON.parse(order.itemsJson)
                : order.itemsJson;
          } catch (e) {
            items = [];
          }
        }

        return { ...order, items };
      });

      setOrders(parsedOrders);
    };

    loadOrders();
  }, []);

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
        Your <Box component="span" sx={{ color: T.gold }}>Orders</Box>
      </Typography>

      {orders.map(order => (
        <Box
          key={order.orderNumber}
          sx={{
            mb: 3,
            bgcolor: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: "12px",
            overflow: "hidden",
            transition: "border-color .2s, transform .2s, box-shadow .2s",
            "&:hover": {
              borderColor: "rgba(233,185,73,.4)",
              transform: "translateY(-4px)",
              boxShadow: "0 12px 32px rgba(0,0,0,.5)",
            }
          }}
        >

          {/* HEADER */}
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            p: 2,
            bgcolor: T.surface,
            borderBottom: `1px solid ${T.border}`
          }}>

            <Box>
              <Typography sx={{ fontSize: 11, color: T.muted, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Order placed
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#fff" }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: 11, color: T.muted, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Order #
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#fff", fontFamily: SYNE }}>
                {order.orderNumber}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontSize: 11, color: T.muted, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Status
              </Typography>
              <Typography sx={{
                fontSize: 12,
                fontFamily: SYNE,
                fontWeight: 700,
                color: T.gold
              }}>
                {order.orderStatus}
              </Typography>
            </Box>

          </Box>

          {/* ITEMS */}
          <Box sx={{ p: 2 }}>
            {order.items.map((item, index) => (
              <Box
                key={item.productId}
                sx={{
                  display: "flex",
                  gap: 2,
                  py: 2,
                  borderBottom:
                    index !== order.items.length - 1
                      ? `1px solid ${T.border}`
                      : "none"
                }}
              >

                {/* Image */}
                <Box
                  component="img"
                  src={item.productImage}
                  alt={item.productName}
                  sx={{
                    width: 90,
                    height: 90,
                    objectFit: "cover",
                    borderRadius: "8px",
                    bgcolor: T.surface,
                    border: `1px solid ${T.border}`
                  }}
                />

                {/* Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{
                    fontFamily: SYNE,
                    fontSize: 14,
                    fontWeight: 700,
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
                    fontWeight: 600,
                    color: T.gold
                  }}>
                    ₹{item.price}
                  </Typography>

                  {/* Review Button */}
                  <Button
                    onClick={() =>
                      navigate(`/review/${item.productId}/${order.orderNumber}`)
                    }
                    sx={{
                      mt: 1,
                      px: 2,
                      py: 0.8,
                      borderRadius: "8px",
                      border: `1.5px solid ${T.border}`,
                      color: T.text,
                      fontFamily: SYNE,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".8px",
                      "&:hover": {
                        borderColor: T.gold,
                        color: T.gold,
                        bgcolor: "rgba(233,185,73,.05)"
                      }
                    }}
                  >
                    Write Review
                  </Button>

                </Box>

              </Box>
            ))}

            {/* ACTION */}
            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Button
                onClick={() => navigate(`/orders/${order.orderNumber}`)}
                sx={{
                  fontFamily: SYNE,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".8px",
                  color: T.gold,
                  "&:hover": {
                    textDecoration: "underline"
                  }
                }}
              >
                View Order Details
              </Button>
            </Box>

          </Box>
        </Box>
      ))}

      {/* Empty */}
      {orders.length === 0 && (
        <Typography sx={{
          mt: 5,
          textAlign: "center",
          color: T.muted
        }}>
          No orders found 📦
        </Typography>
      )}

    </Box>
  );
}