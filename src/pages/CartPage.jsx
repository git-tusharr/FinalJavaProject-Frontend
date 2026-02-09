import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../api/axiosInstance";
import { useCart } from "../services/CartContext";
import WishlistDrawer from "../pages/WishlistDrawer";

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
      alert("Checkout successful!");
      loadCart();
      navigate("/checkout");   // 👈 redirect to checkout screen
    } catch (err) {
      alert("Checkout failed!");
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
    <Box p={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight="bold">
          Your Cart ({items.length} items)
        </Typography>

        <Button
          variant="outlined"
          onClick={() => setOpenWish(true)}
        >
          💙 View Wishlist
        </Button>
      </Box>

      {items.map((item) => (
        <Box
          key={item.id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={1}
          borderBottom="1px solid #ddd"
        >
          <img
            src={item.image || "/placeholder.png"}
            alt={item.productName}
            style={{ width: 70, height: 70, objectFit: "contain" }}
          />

          <Box sx={{ flexGrow: 1, ml: 2 }}>
            <Typography fontWeight="bold">{item.productName}</Typography>
            <Typography color="text.secondary">₹{item.price}</Typography>
          </Box>

          <Box display="flex" alignItems="center" sx={{ mx: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => decreaseQty(item)}
              disabled={item.quantity <= 1}
            >
              -
            </Button>

            <Typography sx={{ mx: 1 }}> {item.quantity} </Typography>

            <Button
              variant="outlined"
              size="small"
              onClick={() => increaseQty(item)}
            >
              +
            </Button>
          </Box>

          <IconButton onClick={() => removeItem(item.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      {items.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6" fontWeight="bold">
            Total: ₹{totalAmount}
          </Typography>

          <Button variant="contained" color="success" onClick={checkout} sx={{ mr: 2, mt: 1 }}>
            Checkout Now
          </Button>

          <Button variant="outlined" color="error" onClick={clearCart} sx={{ mt: 1 }}>
            Clear Cart
          </Button>
        </Box>
      )}

      {items.length === 0 && (
        <Typography sx={{ mt: 3, color: "text.secondary" }}>
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
