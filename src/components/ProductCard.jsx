import { Box, Button, Typography } from "@mui/material";
import API from "../api/axiosInstance";

export default function ProductCard({ product, userId }) {
  const addToCart = async () => {
    await API.post("/cart/add", {
      userId,
      productId: product.id,
      quantity: 1,
    });
    alert("Added to cart");
  };

  const addToWishlist = async () => {
    await API.post("/wishlist/add", {
      userId,
      productId: product.id,
    });
    alert("Added to wishlist");
  };

  return (
    <Box border="1px solid #ddd" p={2} borderRadius={2}>
      <Typography>{product.name}</Typography>
      <Typography>₹{product.price}</Typography>

      <Button onClick={addToCart} variant="contained" size="small" sx={{ mr: 1 }}>
        Add to Cart
      </Button>

      <Button onClick={addToWishlist} variant="outlined" size="small">
        Wishlist
      </Button>
    </Box>
  );
}
