import { useEffect, useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../api/axiosInstance";
import { useParams } from "react-router-dom";

export default function WishlistPage() {
  const { userId } = useParams();
  const [items, setItems] = useState([]);

  const loadWishlist = async () => {
    const res = await API.get(`/wishlist/${userId}`);
    setItems(res.data);
  };

  const removeWish = async (productId) => {
    await API.delete(`/wishlist/remove`, { params: { userId, productId } });
    loadWishlist();
  };

  useEffect(() => { loadWishlist(); }, []);

  return (
    <Box p={2}>
      <Typography variant="h5">Wishlist</Typography>

      {items.map((item) => (
        <Box key={item.id} display="flex" justifyContent="space-between" p={1} borderBottom="1px solid #ddd">
          <Typography>Product ID: {item.productId}</Typography>
          <IconButton onClick={() => removeWish(item.productId)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}
