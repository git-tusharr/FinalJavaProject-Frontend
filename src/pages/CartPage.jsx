import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../api/axiosInstance";
import { useCart } from "../services/CartContext";
import WishlistDrawer from "../pages/WishlistDrawer";

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

export default function CartPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const { loadCartCount } = useCart();
  const [openWish, setOpenWish] = useState(false);

  const loadCart = async () => {
    const res = await API.get(`/cart/${userId}`);
    setItems(res.data);
  };

  const increaseQty = async (item) => {
    await API.post("/cart/add", {
      userId,
      productId: item.productId,
      variantId: item.variantId,
      quantity: 1,
    });
    loadCart();
  };

  const decreaseQty = async (item) => {
    await API.put(`/cart/decrease/${item.id}`);
    loadCart();
  };

  const removeItem = async (id) => {
    await API.delete(`/cart/remove/${id}`);
    loadCart();
    await loadCartCount();
  };

  const clearCart = async () => {
    await API.delete(`/cart/clear/${userId}`);
    loadCart();
    await loadCartCount();
  };

  const checkout = async () => {
    try {
      await API.post(`/checkout/${userId}`);
      toast.success("Checkout successful!");
      loadCart();
      navigate("/checkout");
    } catch (err) {
      toast.success("Checkout failed!");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: T.black,
      px: { xs: 2, md: 4 },
      py: 4,
      fontFamily: DM,
    }}>

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography sx={{
          fontFamily: SYNE,
          fontSize: 22,
          fontWeight: 800,
          color: "#fff"
        }}>
          Your <Box component="span" sx={{ color: T.gold }}>Cart</Box> ({items.length})
        </Typography>

        <Button
          onClick={() => setOpenWish(true)}
          sx={{
            border: `1.5px solid ${T.border}`,
            color: T.text,
            borderRadius: "8px",
            px: 2.5,
            py: 1,
            fontFamily: SYNE,
            fontSize: 12,
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
          View Wishlist
        </Button>
      </Box>

      {/* Items */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2
      }}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              bgcolor: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: "12px",
              transition: "border-color .2s, transform .2s, box-shadow .2s",
              "&:hover": {
                borderColor: "rgba(233,185,73,.4)",
                transform: "translateY(-4px)",
                boxShadow: "0 12px 32px rgba(0,0,0,.5)",
              }
            }}
          >

            {/* Image */}
            <Box
              component="img"
              src={item.image || "/placeholder.png"}
              sx={{
                width: 70,
                height: 70,
                objectFit: "contain",
                bgcolor: T.surface,
                borderRadius: "8px",
                p: 1
              }}
            />

            {/* Info */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{
                fontFamily: SYNE,
                fontSize: 14,
                fontWeight: 700,
                color: "#fff"
              }}>
                {item.productName}
              </Typography>

              <Typography sx={{
                fontSize: 13,
                color: T.gold,
                mt: 0.5,
                fontWeight: 600
              }}>
                ₹{item.price}
              </Typography>
            </Box>

            {/* Quantity Controls */}
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                onClick={() => decreaseQty(item)}
                disabled={item.quantity <= 1}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "8px",
                  border: `1.5px solid ${T.border}`,
                  color: T.text,
                  "&:hover": {
                    borderColor: T.gold,
                    color: T.gold,
                    bgcolor: "rgba(233,185,73,.05)"
                  }
                }}
              >
                -
              </Button>

              <Typography sx={{
                fontFamily: SYNE,
                fontWeight: 700,
                color: "#fff"
              }}>
                {item.quantity}
              </Typography>

              <Button
                onClick={() => increaseQty(item)}
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "8px",
                  border: `1.5px solid ${T.border}`,
                  color: T.text,
                  "&:hover": {
                    borderColor: T.gold,
                    color: T.gold,
                    bgcolor: "rgba(233,185,73,.05)"
                  }
                }}
              >
                +
              </Button>
            </Box>

            {/* Delete */}
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
      </Box>

      {/* Footer */}
      {items.length > 0 && (
        <Box mt={4} sx={{
          p: 3,
          bgcolor: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: "12px"
        }}>
          <Typography sx={{
            fontFamily: SYNE,
            fontSize: 18,
            fontWeight: 800,
            color: "#fff"
          }}>
            Total: <Box component="span" sx={{ color: T.gold }}>₹{totalAmount}</Box>
          </Typography>

          <Box mt={2} display="flex" gap={2} flexWrap="wrap">

            {/* Checkout */}
            <Button
              onClick={checkout}
              sx={{
                bgcolor: T.gold,
                color: "#000",
                fontFamily: SYNE,
                fontWeight: 700,
                borderRadius: "8px",
                px: 3.5,
                py: 1.5,
                textTransform: "uppercase",
                letterSpacing: ".8px",
                "&:hover": {
                  bgcolor: T.goldHov,
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 28px rgba(233,185,73,.35)"
                }
              }}
            >
              Checkout Now
            </Button>

            {/* Clear */}
            <Button
              onClick={clearCart}
              sx={{
                border: "1.5px solid rgba(208,49,45,.2)",
                color: T.red,
                bgcolor: "rgba(208,49,45,.05)",
                fontFamily: SYNE,
                fontWeight: 700,
                borderRadius: "8px",
                px: 3,
                py: 1.5,
                textTransform: "uppercase",
                "&:hover": {
                  bgcolor: "rgba(208,49,45,.1)"
                }
              }}
            >
              Clear Cart
            </Button>

          </Box>
        </Box>
      )}

      {/* Empty */}
      {items.length === 0 && (
        <Typography sx={{
          mt: 5,
          textAlign: "center",
          color: T.muted,
          fontFamily: DM
        }}>
          Your cart is empty 🛒
        </Typography>
      )}

      <WishlistDrawer
        open={openWish}
        onClose={() => setOpenWish(false)}
        userId={userId}
      />
    </Box>
  );
}
