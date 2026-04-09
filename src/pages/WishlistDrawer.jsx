import { Box, Typography, IconButton, Drawer, Skeleton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import API from "../api/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const T = {
  black:   "#080808",
  surface: "#111111",
  card:    "#141414",
  border:  "#1e1e1e",
  gold:    "#E9B949",
  goldHov: "#f5c84e",
  goldDim: "rgba(233,185,73,.08)",
  goldRim: "rgba(233,185,73,.18)",
  red:     "#D0312D",
  redDim:  "rgba(208,49,45,.08)",
  redRim:  "rgba(208,49,45,.22)",
  text:    "#e2e2e2",
  muted:   "#666666",
  muted2:  "#888888",
};
const SYNE = "'Syne', sans-serif";
const DM   = "'DM Sans', sans-serif";

export default function WishlistDrawer({ open, onClose, userId }) {
  const navigate = useNavigate();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(null);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/wishlist/${userId}`);
      setItems(res.data);
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeWish = async (productId) => {
    try {
      setRemoving(productId);
      await API.delete(`/wishlist/remove`, { params: { userId, productId } });
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setRemoving(null);
    }
  };

  useEffect(() => {
    if (open) loadWishlist();
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 380 },
          bgcolor: T.surface,
          borderLeft: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* ── Header ── */}
      <Box sx={{
        flexShrink: 0,
        px: 2.5, pt: 2.5, pb: 2,
        borderBottom: `1px solid ${T.border}`,
        position: "relative",
        background: `linear-gradient(135deg, rgba(233,185,73,.04) 0%, transparent 60%)`,
      }}>
        {/* Gold top bar */}
        <Box sx={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: "2px",
          background: `linear-gradient(90deg, ${T.red}, ${T.gold})`,
        }} />

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: "9px",
              bgcolor: T.redDim, border: `1px solid ${T.redRim}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <FavoriteIcon sx={{ fontSize: 16, color: T.red }} />
            </Box>
            <Box>
              <Box sx={{
                fontFamily: SYNE, fontWeight: 800, fontSize: 16, color: "#fff", lineHeight: 1,
              }}>
                My <Box component="span" sx={{ color: T.gold }}>Wishlist</Box>
              </Box>
              {!loading && (
                <Box sx={{ fontFamily: DM, fontSize: 11, color: T.muted, mt: "2px" }}>
                  {items.length} saved item{items.length !== 1 ? "s" : ""}
                </Box>
              )}
            </Box>
          </Box>

          {/* Close button */}
          <IconButton
            onClick={onClose}
            sx={{
              width: 32, height: 32, borderRadius: "8px",
              bgcolor: T.card, border: `1px solid ${T.border}`,
              color: T.muted,
              "&:hover": { borderColor: T.red, color: T.red, bgcolor: T.redDim },
              transition: "all .18s",
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      {/* ── Scrollable list ── */}
      <Box sx={{
        flex: 1,
        overflowY: "auto",
        px: 2, py: 2,
        scrollbarWidth: "thin",
        scrollbarColor: `${T.border} transparent`,
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
        "&::-webkit-scrollbar-thumb": { bgcolor: T.border, borderRadius: 4 },
      }}>

        {/* Loading skeletons */}
        {loading && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {[1, 2, 3].map((n) => (
              <Box key={n} sx={{
                display: "flex", gap: 1.5, alignItems: "center",
                bgcolor: T.card, border: `1px solid ${T.border}`,
                borderRadius: "12px", p: 1.5,
              }}>
                <Skeleton variant="rounded" width={58} height={58}
                  sx={{ bgcolor: T.border, borderRadius: "9px", flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" sx={{ bgcolor: T.border, mb: .5 }} />
                  <Skeleton variant="text" width="40%" sx={{ bgcolor: T.border }} />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <Box sx={{
            textAlign: "center",
            py: 8, px: 2,
          }}>
            <FavoriteBorderIcon sx={{ fontSize: 44, color: T.muted, mb: 1.5 }} />
            <Box sx={{ fontFamily: SYNE, fontWeight: 700, fontSize: 15, color: T.text, mb: .8 }}>
              Nothing saved yet
            </Box>
            <Box sx={{ fontFamily: DM, fontSize: 12.5, color: T.muted, mb: 3 }}>
              Items you wishlist will appear here
            </Box>
            <Box
              component="button"
              onClick={() => { onClose(); navigate("/products"); }}
              sx={{
                px: 3, py: 1.2,
                bgcolor: T.gold, color: "#000", border: "none", borderRadius: "8px",
                fontFamily: SYNE, fontWeight: 700, fontSize: 11,
                letterSpacing: ".8px", textTransform: "uppercase",
                cursor: "pointer", transition: "all .2s",
                "&:hover": { bgcolor: T.goldHov, transform: "translateY(-1px)" },
              }}
            >
              Browse Deals
            </Box>
          </Box>
        )}

        {/* Items */}
        {!loading && items.map((item, idx) => (
          <Box
            key={item.id}
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              bgcolor: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: "12px",
              p: 1.4,
              mb: 1.5,
              opacity: removing === item.productId ? 0.45 : 1,
              transition: "all .2s",
              animation: `fadeIn .25s ease both`,
              animationDelay: `${idx * 0.05}s`,
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateX(12px)" },
                to:   { opacity: 1, transform: "translateX(0)" },
              },
              "&:hover": {
                borderColor: "rgba(233,185,73,.25)",
                boxShadow: "0 4px 18px rgba(0,0,0,.35)",
              },
            }}
          >
            {/* Image */}
            <Box
              component="img"
              src={item.imageUrl}
              alt={item.name}
              onClick={() => { onClose(); navigate(`/product/${item.productId}`); }}
              sx={{
                width: 58, height: 58,
                objectFit: "cover",
                borderRadius: "9px",
                border: `1px solid ${T.border}`,
                flexShrink: 0,
                cursor: "pointer",
                transition: "opacity .18s",
                "&:hover": { opacity: .8 },
              }}
            />

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                onClick={() => { onClose(); navigate(`/product/${item.productId}`); }}
                sx={{
                  fontFamily: DM, fontWeight: 500, fontSize: 13,
                  color: T.text,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  cursor: "pointer", mb: .4,
                  "&:hover": { color: T.gold },
                  transition: "color .15s",
                }}
              >
                {item.name}
              </Box>
              {item.price && (
                <Box sx={{
                  fontFamily: SYNE, fontWeight: 700, fontSize: 13.5, color: T.gold,
                }}>
                  ₹{item.price.toLocaleString("en-IN")}
                </Box>
              )}
            </Box>

            {/* Delete */}
            <IconButton
              onClick={() => removeWish(item.productId)}
              disabled={removing === item.productId}
              sx={{
                width: 32, height: 32, flexShrink: 0,
                bgcolor: T.redDim, border: `1px solid ${T.redRim}`,
                borderRadius: "8px", color: T.red,
                transition: "all .18s",
                "&:hover": { bgcolor: "rgba(208,49,45,.18)", transform: "scale(1.1)" },
              }}
            >
              <DeleteIcon sx={{ fontSize: 15 }} />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* ── Footer ── */}
      {!loading && items.length > 0 && (
        <Box sx={{
          flexShrink: 0,
          p: 2,
          borderTop: `1px solid ${T.border}`,
          bgcolor: "rgba(0,0,0,.2)",
        }}>
          <Box
            component="button"
            onClick={() => { onClose(); navigate(`/wishlist/${userId}`); }}
            sx={{
              width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
              py: 1.3,
              bgcolor: T.goldDim, border: `1px solid ${T.goldRim}`,
              borderRadius: "10px",
              color: T.gold,
              fontFamily: SYNE, fontWeight: 700, fontSize: 12,
              letterSpacing: ".8px", textTransform: "uppercase",
              cursor: "pointer", transition: "all .2s",
              "&:hover": { bgcolor: T.gold, color: "#000", boxShadow: `0 6px 20px rgba(233,185,73,.25)` },
            }}
          >
            View Full Wishlist
            <ArrowForwardIcon sx={{ fontSize: 15 }} />
          </Box>
        </Box>
      )}
    </Drawer>
  );
}