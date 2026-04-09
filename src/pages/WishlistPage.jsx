import { useEffect, useState } from "react";
import { Box, Typography, IconButton, Skeleton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import API from "../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
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
};
const SYNE = "'Syne', sans-serif";
const DM   = "'DM Sans', sans-serif";

export default function WishlistPage() {
  const { userId } = useParams();
  const navigate   = useNavigate();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => { loadWishlist(); }, []);

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: T.black,
      fontFamily: DM,
      px: { xs: 2, sm: 4, md: 8 },
      py: { xs: 4, sm: 6 },
      background: `
        radial-gradient(ellipse at 70% 0%, rgba(233,185,73,.05) 0%, transparent 55%),
        radial-gradient(ellipse at 20% 100%, rgba(208,49,45,.04) 0%, transparent 50%),
        ${T.black}
      `,
    }}>

      {/* ── Page header ── */}
      <Box sx={{ mb: { xs: 4, sm: 6 }, maxWidth: 900, mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: "10px",
            bgcolor: T.redDim, border: `1px solid ${T.redRim}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FavoriteIcon sx={{ fontSize: 18, color: T.red }} />
          </Box>
          <Box>
            <Box sx={{
              fontFamily: SYNE, fontWeight: 800, fontSize: { xs: 22, sm: 28 },
              color: "#fff", lineHeight: 1,
            }}>
              My{" "}
              <Box component="span" sx={{ color: T.gold }}>Wishlist</Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ fontFamily: DM, fontSize: 13, color: T.muted, mt: 1 }}>
          {!loading && `${items.length} saved item${items.length !== 1 ? "s" : ""}`}
        </Box>
        {/* Gold accent line */}
        <Box sx={{
          mt: 2.5, height: "1.5px", maxWidth: 60,
          background: `linear-gradient(90deg, ${T.gold}, transparent)`,
        }} />
      </Box>

      <Box sx={{ maxWidth: 900, mx: "auto" }}>

        {/* ── Loading skeletons ── */}
        {loading && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2, 3].map((n) => (
              <Box key={n} sx={{
                bgcolor: T.card, border: `1px solid ${T.border}`,
                borderRadius: "14px", p: 2,
                display: "flex", gap: 2, alignItems: "center",
              }}>
                <Skeleton variant="rounded" width={80} height={80}
                  sx={{ bgcolor: T.border, borderRadius: "10px", flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" sx={{ bgcolor: T.border, mb: 1 }} />
                  <Skeleton variant="text" width="30%" sx={{ bgcolor: T.border }} />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* ── Empty state ── */}
        {!loading && items.length === 0 && (
          <Box sx={{
            textAlign: "center", py: { xs: 8, sm: 12 },
            bgcolor: T.card, border: `1px solid ${T.border}`,
            borderRadius: "16px",
          }}>
            <FavoriteBorderIcon sx={{ fontSize: 52, color: T.muted, mb: 2 }} />
            <Box sx={{ fontFamily: SYNE, fontWeight: 700, fontSize: 18, color: T.text, mb: 1 }}>
              Your wishlist is empty
            </Box>
            <Box sx={{ fontFamily: DM, fontSize: 13, color: T.muted, mb: 3 }}>
              Save items you love to find them easily later
            </Box>
            <Box
              component="button"
              onClick={() => navigate("/products")}
              sx={{
                px: 3.5, py: 1.4,
                bgcolor: T.gold, color: "#000",
                border: "none", borderRadius: "8px",
                fontFamily: SYNE, fontWeight: 700, fontSize: 12,
                letterSpacing: ".8px", textTransform: "uppercase",
                cursor: "pointer", transition: "all .2s",
                "&:hover": { bgcolor: T.goldHov, transform: "translateY(-2px)", boxShadow: `0 8px 28px rgba(233,185,73,.3)` },
              }}
            >
              Browse Deals
            </Box>
          </Box>
        )}

        {/* ── Wishlist items ── */}
        {!loading && items.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {items.map((item, idx) => (
              <Box
                key={item.id}
                sx={{
                  bgcolor: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: "14px",
                  p: { xs: 1.5, sm: 2 },
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1.5, sm: 2 },
                  transition: "border-color .2s, transform .2s, box-shadow .2s",
                  opacity: removing === item.productId ? 0.5 : 1,
                  animation: `fadeSlideIn .3s ease both`,
                  animationDelay: `${idx * 0.06}s`,
                  "@keyframes fadeSlideIn": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to:   { opacity: 1, transform: "translateY(0)" },
                  },
                  "&:hover": {
                    borderColor: "rgba(233,185,73,.3)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 28px rgba(0,0,0,.4)",
                  },
                }}
              >
                {/* Product image */}
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.name}
                  onClick={() => navigate(`/product/${item.productId}`)}
                  sx={{
                    width: { xs: 70, sm: 88 },
                    height: { xs: 70, sm: 88 },
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: `1px solid ${T.border}`,
                    flexShrink: 0,
                    cursor: "pointer",
                    transition: "opacity .2s",
                    "&:hover": { opacity: .85 },
                  }}
                />

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    onClick={() => navigate(`/product/${item.productId}`)}
                    sx={{
                      fontFamily: DM, fontWeight: 600,
                      fontSize: { xs: 13.5, sm: 15 },
                      color: T.text,
                      cursor: "pointer",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      mb: .5,
                      "&:hover": { color: T.gold },
                      transition: "color .18s",
                    }}
                  >
                    {item.name}
                  </Box>

                  {item.price && (
                    <Box sx={{
                      fontFamily: SYNE, fontWeight: 700,
                      fontSize: { xs: 14, sm: 16 },
                      color: T.gold,
                    }}>
                      ₹{item.price.toLocaleString("en-IN")}
                    </Box>
                  )}

                  {/* View button — hidden on very small screens */}
                  <Box
                    component="button"
                    onClick={() => navigate(`/product/${item.productId}`)}
                    sx={{
                      display: { xs: "none", sm: "inline-flex" },
                      mt: 1,
                      px: 2, py: .6,
                      bgcolor: "transparent",
                      border: `1px solid ${T.border}`,
                      borderRadius: "6px",
                      color: T.muted,
                      fontFamily: DM, fontSize: 12, fontWeight: 500,
                      cursor: "pointer", transition: "all .18s",
                      "&:hover": { borderColor: T.gold, color: T.gold, bgcolor: T.goldDim },
                    }}
                  >
                    View Product →
                  </Box>
                </Box>

                {/* Remove button */}
                <IconButton
                  onClick={() => removeWish(item.productId)}
                  disabled={removing === item.productId}
                  sx={{
                    flexShrink: 0,
                    width: 38, height: 38,
                    bgcolor: T.redDim,
                    border: `1px solid ${T.redRim}`,
                    borderRadius: "9px",
                    color: T.red,
                    transition: "all .18s",
                    "&:hover": { bgcolor: "rgba(208,49,45,.18)", borderColor: T.red, transform: "scale(1.08)" },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}