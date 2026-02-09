import { Box, Typography, IconButton } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../api/axiosInstance";
import { useEffect, useState } from "react";

export default function WishlistDrawer({ open, onClose, userId }) {
  const [items, setItems] = useState([]);

  const loadWishlist = async () => {
    const res = await API.get(`/wishlist/${userId}`);
    setItems(res.data);
  };

  const removeWish = async (productId) => {
    await API.delete(`/wishlist/remove`, { params: { userId, productId } });
    loadWishlist();
  };

  useEffect(() => {
    if (open) loadWishlist();
  }, [open]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={2} width="320px">
        <Typography variant="h6" gutterBottom>
          💙 Wishlist
        </Typography>

        {items.length === 0 && <Typography>No items yet.</Typography>}

        {items.map((item) => (
          <Box
            key={item.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid #ddd"
            py={1}
            gap={1}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <img
                src={item.imageUrl}
                alt={item.name}
                width={50}
                height={50}
                style={{ objectFit: "cover", borderRadius: 4 }}
              />
              <Typography sx={{ maxWidth: 140 }} noWrap>
                {item.name}
              </Typography>
            </Box>

            <IconButton onClick={() => removeWish(item.productId)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}
