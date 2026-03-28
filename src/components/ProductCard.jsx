import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, IconButton, Chip, Tooltip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import API from "../api/axiosInstance";

/* ── brand tokens ── */
const T = {
  black:   "#080808",
  card:    "#141414",
  border:  "#1e1e1e",
  gold:    "#E9B949",
  goldHov: "#f5c84e",
  red:     "#D0312D",
  text:    "#e2e2e2",
  muted:   "#666666",
  green:   "#4ade80",
  surface: "#1a1a1a",
};

const SYNE = "'Syne', sans-serif";
const DM   = "'DM Sans', sans-serif";

export default function ProductCard({ product, userId }) {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [cartDone, setCartDone] = useState(false);

  /* derive discount % if mrp is available */
  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  const addToCart = async (e) => {
    e.stopPropagation();
    setCartLoading(true);
    try {
      await API.post("/cart/add", {
        userId,
        productId: product.id,
        quantity: 1,
      });
      setCartDone(true);
      setTimeout(() => setCartDone(false), 2000);
    } catch {
      /* handle silently */
    } finally {
      setCartLoading(false);
    }
  };

  const addToWishlist = async (e) => {
    e.stopPropagation();
    setWishLoading(true);
    try {
      await API.post("/wishlist/add", {
        userId,
        productId: product.id,
      });
      setWishlisted(true);
    } catch {
      /* handle silently */
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <Box
      onClick={() => navigate(`/product/${product.id}`)}
      sx={{
        bgcolor: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "border-color .2s, transform .2s, box-shadow .2s",
        "&:hover": {
          borderColor: "rgba(233,185,73,.4)",
          transform: "translateY(-4px)",
          boxShadow: "0 12px 32px rgba(0,0,0,.55)",
        },
      }}
    >
      {/* ── Image area ── */}
      <Box sx={{
        position: "relative",
        height: 190,
        background: "linear-gradient(135deg, #181818 0%, #1e1e1e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Product image or emoji fallback */}
        {product.image ? (
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: "100%", height: "100%",
              objectFit: "cover",
              transition: "transform .3s",
              ".MuiBox-root:hover &": { transform: "scale(1.05)" },
            }}
          />
        ) : (
          <Typography sx={{ fontSize: 52, userSelect: "none" }}>
            🛍️
          </Typography>
        )}

        {/* Discount badge */}
        {discount && (
          <Chip
            label={`${discount}% OFF`}
            size="small"
            sx={{
              position: "absolute", top: 10, left: 10,
              bgcolor: T.red, color: "#fff",
              fontFamily: SYNE, fontSize: 10,
              fontWeight: 700, letterSpacing: ".8px",
              height: 22, borderRadius: "4px",
            }}
          />
        )}

        {/* Wishlist button */}
        <Tooltip title={wishlisted ? "Wishlisted" : "Add to Wishlist"} placement="left">
          <IconButton
            onClick={addToWishlist}
            disabled={wishLoading || wishlisted}
            sx={{
              position: "absolute", top: 8, right: 8,
              bgcolor: "rgba(0,0,0,.5)",
              backdropFilter: "blur(4px)",
              border: `1px solid ${wishlisted ? "rgba(208,49,45,.4)" : T.border}`,
              width: 32, height: 32,
              "&:hover": { bgcolor: "rgba(208,49,45,.15)", borderColor: T.red },
              transition: "all .2s",
            }}
          >
            {wishlisted
              ? <FavoriteIcon sx={{ fontSize: 16, color: T.red }} />
              : <FavoriteBorderIcon sx={{ fontSize: 16, color: T.muted }} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Body ── */}
      <Box sx={{
        p: "14px 16px 16px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 0.7,
      }}>
        {/* Product name */}
        <Typography sx={{
          fontFamily: DM, fontSize: 14, fontWeight: 600,
          color: T.text, lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {product.name}
        </Typography>

        {/* Category / meta */}
        {product.category && (
          <Typography sx={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>
            {product.category}
          </Typography>
        )}

        {/* Price row */}
        <Box sx={{
          display: "flex", alignItems: "baseline",
          gap: 1, mt: "auto", pt: 1.5, flexWrap: "wrap",
        }}>
          <Typography sx={{
            fontFamily: SYNE, fontSize: 18,
            fontWeight: 800, color: T.gold,
          }}>
            ₹{Number(product.price).toLocaleString("en-IN")}
          </Typography>
          {product.mrp && product.mrp > product.price && (
            <Typography sx={{ fontSize: 12, color: T.muted, textDecoration: "line-through" }}>
              ₹{Number(product.mrp).toLocaleString("en-IN")}
            </Typography>
          )}
          {discount && (
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: T.green, ml: "auto" }}>
              {discount}% OFF
            </Typography>
          )}
        </Box>

        {/* ── Add to Cart button ── */}
        <Box
          component="button"
          onClick={addToCart}
          disabled={cartLoading}
          sx={{
            mt: 1.5,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            bgcolor: cartDone
              ? "rgba(74,222,128,.12)"
              : "rgba(233,185,73,.1)",
            border: `1.5px solid ${cartDone ? "rgba(74,222,128,.4)" : "rgba(233,185,73,.25)"}`,
            borderRadius: "8px",
            py: "10px",
            fontFamily: SYNE,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".8px",
            textTransform: "uppercase",
            color: cartDone ? T.green : T.gold,
            cursor: cartLoading ? "not-allowed" : "pointer",
            opacity: cartLoading ? 0.6 : 1,
            transition: "all .2s",
            "&:hover": !cartLoading && !cartDone ? {
              bgcolor: T.gold,
              color: "#000",
              borderColor: T.gold,
              boxShadow: "0 4px 16px rgba(233,185,73,.25)",
            } : {},
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 16 }} />
          {cartLoading ? "Adding..." : cartDone ? "✓ Added!" : "Add to Cart"}
        </Box>
      </Box>
    </Box>
  );
}