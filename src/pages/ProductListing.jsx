import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Skeleton, Chip } from "@mui/material";
import API from "../api/axiosInstance";
import { useCart } from "../services/CartContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import BoltIcon from "@mui/icons-material/Bolt";

/* ── Brand tokens ── */
const T = {
  black:    "#080808",
  surface:  "#111111",
  card:     "#141414",
  border:   "#1e1e1e",
  gold:     "#E9B949",
  goldHov:  "#f5c84e",
  goldDim:  "rgba(233,185,73,.07)",
  goldRim:  "rgba(233,185,73,.18)",
  red:      "#D0312D",
  redDim:   "rgba(208,49,45,.15)",
  redRim:   "rgba(208,49,45,.3)",
  text:     "#e2e2e2",
  muted:    "#555555",
  muted2:   "#888888",
  green:    "#4ade80",
  greenDim: "rgba(74,222,128,.12)",
  greenRim: "rgba(74,222,128,.28)",
};
const SYNE = "'Syne', sans-serif";
const DM   = "'DM Sans', sans-serif";

/* ── Helpers ── */
function getTag(p) {
  if (p.tag) return p.tag;
  if (p.rating >= 4.5) return "HOT";
  if (p.isNew) return "NEW";
  return null;
}
function getDiscount(price, mrp) {
  if (!mrp || mrp <= price) return null;
  return Math.round(((mrp - price) / mrp) * 100);
}
function getMonogram(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
}

/* ─────────────────────────────
   SKELETON
───────────────────────────── */
function SkeletonCard() {
  return (
    <Box sx={{ bgcolor: T.card, border: `1px solid ${T.border}`, borderRadius: "14px", overflow: "hidden" }}>
      <Skeleton variant="rectangular" height={175} sx={{ bgcolor: "#1a1a1a" }} />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="40%" height={14} sx={{ bgcolor: "#1a1a1a", mb: 1 }} />
        <Skeleton variant="text" width="85%" height={18} sx={{ bgcolor: "#1a1a1a", mb: .5 }} />
        <Skeleton variant="text" width="60%" height={14} sx={{ bgcolor: "#1a1a1a", mb: 1.5 }} />
        <Skeleton variant="text" width="45%" height={26} sx={{ bgcolor: "#1a1a1a", mb: 2 }} />
        <Skeleton variant="rounded" height={38} sx={{ bgcolor: "#1a1a1a", borderRadius: "8px" }} />
      </Box>
    </Box>
  );
}

/* ─────────────────────────────
   GRID CARD  (Home page style)
───────────────────────────── */
function GridCard({ p, idx, onAddToCart }) {
  const navigate  = useNavigate();
  const [adding, setAdding] = useState(false);

  const tag      = getTag(p);
  const discount = getDiscount(p.price, p.mrp || p.originalPrice);
  const monogram = getMonogram(p.name);

  const handleAdd = async (e) => {
    e.stopPropagation();
    setAdding(true);
    await onAddToCart(p.productId);
    setAdding(false);
  };

  return (
    <Box
      onClick={() => navigate(`/product/${p.productId}`)}
      sx={{
        bgcolor: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: "14px",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex", flexDirection: "column",
        height: "100%",
        position: "relative",
        animation: `sdFadeUp .38s ease both`,
        animationDelay: `${idx * 0.05}s`,
        "@keyframes sdFadeUp": {
          from: { opacity: 0, transform: "translateY(18px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        transition: "border-color .22s, box-shadow .22s, transform .22s",
        "&:hover": {
          borderColor: "rgba(233,185,73,.42)",
          transform: "translateY(-5px)",
          boxShadow: "0 16px 40px rgba(0,0,0,.6)",
        },
      }}
    >
      {/* ── Image zone — gradient bg + monogram (exactly like Home) ── */}
      <Box sx={{
        height: { xs: 148, sm: 175 },
        background: "linear-gradient(145deg, #181818 0%, #1c1c1c 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
        borderBottom: `1px solid ${T.border}`,
        overflow: "hidden",
      }}>
        {/* Monogram watermark */}
        <Box sx={{
          fontFamily: SYNE, fontWeight: 800,
          fontSize: { xs: 36, sm: 44 },
          color: "rgba(233,185,73,.13)",
          letterSpacing: 4, userSelect: "none",
          position: "absolute",
        }}>
          {monogram}
        </Box>

        {/* Real product image on top */}
        {p.image && (
          <Box
            component="img"
            src={p.image}
            alt={p.name}
            sx={{
              position: "relative", zIndex: 1,
              maxHeight: "82%", maxWidth: "82%",
              objectFit: "contain",
              transition: "transform .32s ease",
            }}
          />
        )}

        {/* Tag chip — top left (HOT / NEW / DEAL) */}
        {tag && (
          <Chip
            label={tag}
            size="small"
            icon={
              tag === "HOT"  ? <LocalFireDepartmentIcon sx={{ fontSize: "10px !important", ml: "6px !important" }} /> :
              tag === "DEAL" ? <BoltIcon sx={{ fontSize: "10px !important", ml: "6px !important" }} /> :
              undefined
            }
            sx={{
              position: "absolute", top: 10, left: 10, zIndex: 2,
              bgcolor:
                tag === "NEW"  ? T.greenDim :
                tag === "HOT"  ? T.red :
                                 T.redDim,
              color: tag === "NEW" ? T.green : "#fff",
              border:
                tag === "NEW"  ? `1px solid ${T.greenRim}` :
                tag === "HOT"  ? "none" :
                                 `1px solid ${T.redRim}`,
              fontFamily: SYNE, fontSize: 9, fontWeight: 700,
              letterSpacing: "1px", height: 20, borderRadius: "5px",
              "& .MuiChip-label": { px: "6px" },
            }}
          />
        )}

        {/* Discount % badge — top right */}
        {discount && (
          <Box sx={{
            position: "absolute", top: 10, right: 10, zIndex: 2,
            bgcolor: T.greenDim, border: `1px solid ${T.greenRim}`,
            borderRadius: "5px", px: "7px", py: "2px",
          }}>
            <Box sx={{ fontFamily: SYNE, fontSize: 10, fontWeight: 700, color: T.green }}>
              {discount}% OFF
            </Box>
          </Box>
        )}
      </Box>

      {/* ── Content ── */}
      <Box sx={{
        p: { xs: "12px 14px 16px", sm: "14px 16px 18px" },
        flex: 1, display: "flex", flexDirection: "column", gap: .6,
      }}>

        {/* Brand */}
        <Box sx={{
          fontFamily: DM, fontSize: 10.5, fontWeight: 600,
          letterSpacing: "1.4px", textTransform: "uppercase", color: T.muted2,
        }}>
          {p.brand || "StealDeals"}
        </Box>

        {/* Name — 2 line clamp */}
        <Box sx={{
          fontFamily: DM, fontWeight: 600, fontSize: { xs: 13, sm: 14 },
          color: T.text, lineHeight: 1.38,
          display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden", flex: 1,
        }}>
          {p.name}
        </Box>

        {/* "Free delivery · In stock" */}
        <Box sx={{ fontFamily: DM, fontSize: 10.5, color: T.muted }}>
          Free delivery · In stock
        </Box>

        {/* Price + MRP (strikethrough) — same as Home cards */}
        <Box sx={{
          display: "flex", alignItems: "baseline",
          gap: 1, flexWrap: "wrap", mt: "auto", pt: 1,
        }}>
          <Box sx={{ fontFamily: SYNE, fontWeight: 800, fontSize: { xs: 18, sm: 20 }, color: T.gold, lineHeight: 1 }}>
            ₹{Number(p.price).toLocaleString("en-IN")}
          </Box>
          {(p.mrp || p.originalPrice) && (
            <Box sx={{ fontFamily: DM, fontSize: 12, color: T.muted, textDecoration: "line-through" }}>
              ₹{Number(p.mrp || p.originalPrice).toLocaleString("en-IN")}
            </Box>
          )}
        </Box>

        {/* Rating row */}
        {p.rating && (
          <Box sx={{ display: "flex", alignItems: "center", gap: .4 }}>
            <StarIcon sx={{ fontSize: 11, color: T.gold }} />
            <Box sx={{ fontFamily: DM, fontSize: 11.5, color: T.muted2 }}>{p.rating}</Box>
          </Box>
        )}

        {/* Add to Cart */}
        <Box
          component="button"
          onClick={handleAdd}
          disabled={adding}
          sx={{
            mt: .5,
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
            py: "10px",
            bgcolor: adding ? T.border : T.gold,
            color: adding ? T.muted : "#000",
            border: "none", borderRadius: "8px",
            fontFamily: SYNE, fontWeight: 700,
            fontSize: { xs: 11, sm: 12 },
            letterSpacing: ".6px", textTransform: "uppercase",
            cursor: adding ? "not-allowed" : "pointer",
            transition: "all .2s",
            "&:hover": !adding ? { bgcolor: T.goldHov, boxShadow: "0 6px 20px rgba(233,185,73,.3)" } : {},
          }}
        >
          {adding
            ? <CircularProgress size={14} sx={{ color: T.muted }} />
            : <ShoppingCartIcon sx={{ fontSize: 15 }} />}
          {adding ? "Adding…" : "Add to Cart"}
        </Box>
      </Box>
    </Box>
  );
}

/* ─────────────────────────────
   LIST CARD
───────────────────────────── */
function ListCard({ p, idx, onAddToCart }) {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const tag      = getTag(p);
  const discount = getDiscount(p.price, p.mrp || p.originalPrice);
  const monogram = getMonogram(p.name);

  const handleAdd = async (e) => {
    e.stopPropagation();
    setAdding(true);
    await onAddToCart(p.productId);
    setAdding(false);
  };

  return (
    <Box
      onClick={() => navigate(`/product/${p.productId}`)}
      sx={{
        display: "flex", alignItems: "center",
        gap: { xs: 1.5, sm: 2.5 },
        bgcolor: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: "14px",
        overflow: "hidden",
        cursor: "pointer",
        animation: `sdFadeUp .35s ease both`,
        animationDelay: `${idx * 0.04}s`,
        "@keyframes sdFadeUp": {
          from: { opacity: 0, transform: "translateY(14px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        transition: "border-color .2s, box-shadow .2s, transform .2s",
        "&:hover": {
          borderColor: "rgba(233,185,73,.35)",
          boxShadow: "0 8px 32px rgba(0,0,0,.5)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Thumbnail with gradient + monogram */}
      <Box sx={{
        width: { xs: 90, sm: 120 }, height: { xs: 90, sm: 110 },
        flexShrink: 0,
        background: "linear-gradient(145deg, #181818 0%, #1c1c1c 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        <Box sx={{
          fontFamily: SYNE, fontWeight: 800, fontSize: 22,
          color: "rgba(233,185,73,.13)", letterSpacing: 2, userSelect: "none",
          position: "absolute",
        }}>
          {monogram}
        </Box>
        {p.image && (
          <Box component="img" src={p.image} alt={p.name}
            sx={{ position: "relative", zIndex: 1, maxWidth: "78%", maxHeight: "78%", objectFit: "contain" }}
          />
        )}
        {tag && (
          <Box sx={{
            position: "absolute", top: 6, left: 6, zIndex: 2,
            bgcolor: tag === "NEW" ? T.greenDim : T.red,
            border: tag === "NEW" ? `1px solid ${T.greenRim}` : "none",
            borderRadius: "4px", px: "5px", py: "1px",
          }}>
            <Box sx={{ fontFamily: SYNE, fontSize: 8, fontWeight: 700, color: tag === "NEW" ? T.green : "#fff", letterSpacing: "1px" }}>
              {tag}
            </Box>
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0, py: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ fontFamily: DM, fontSize: 10, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: T.muted2, mb: .3 }}>
          {p.brand || "StealDeals"}
        </Box>
        <Box sx={{ fontFamily: DM, fontWeight: 600, fontSize: { xs: 13, sm: 15 }, color: T.text, mb: .5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {p.name}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Box sx={{ fontFamily: SYNE, fontWeight: 800, fontSize: { xs: 15, sm: 18 }, color: T.gold, lineHeight: 1 }}>
            ₹{Number(p.price).toLocaleString("en-IN")}
          </Box>
          {(p.mrp || p.originalPrice) && (
            <Box sx={{ fontFamily: DM, fontSize: 11.5, color: T.muted, textDecoration: "line-through" }}>
              ₹{Number(p.mrp || p.originalPrice).toLocaleString("en-IN")}
            </Box>
          )}
          {discount && (
            <Box sx={{ bgcolor: T.greenDim, border: `1px solid ${T.greenRim}`, borderRadius: "4px", px: "6px", py: "1px" }}>
              <Box sx={{ fontFamily: SYNE, fontSize: 9, fontWeight: 700, color: T.green }}>{discount}% OFF</Box>
            </Box>
          )}
        </Box>
        {p.rating && (
          <Box sx={{ display: "flex", alignItems: "center", gap: .4, mt: .5 }}>
            <StarIcon sx={{ fontSize: 11, color: T.gold }} />
            <Box sx={{ fontFamily: DM, fontSize: 11.5, color: T.muted2 }}>{p.rating}</Box>
            <Box sx={{ fontFamily: DM, fontSize: 11, color: T.muted }}>· Free delivery</Box>
          </Box>
        )}
      </Box>

      {/* Cart button */}
      <Box sx={{ pr: { xs: 1.5, sm: 2.5 }, flexShrink: 0 }}>
        <Box
          component="button"
          onClick={handleAdd}
          disabled={adding}
          sx={{
            display: "flex", alignItems: "center", gap: .8,
            px: { xs: 1.4, sm: 2.2 }, py: 1.1,
            bgcolor: adding ? T.border : T.gold,
            color: adding ? T.muted : "#000",
            border: "none", borderRadius: "9px",
            fontFamily: SYNE, fontWeight: 700, fontSize: 11,
            letterSpacing: ".6px", textTransform: "uppercase",
            cursor: adding ? "not-allowed" : "pointer",
            transition: "all .2s", whiteSpace: "nowrap",
            "&:hover": !adding ? { bgcolor: T.goldHov, transform: "translateY(-1px)" } : {},
          }}
        >
          {adding ? <CircularProgress size={13} sx={{ color: T.muted }} /> : <ShoppingCartIcon sx={{ fontSize: 14 }} />}
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            {adding ? "Adding…" : "Add to Cart"}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ─────────────────────────────
   MAIN PAGE
───────────────────────────── */
export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState("grid");

  const { loadCartCount } = useCart();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const variantRes = await axios.get(`http://localhost:8080/api/products/${productId}/variants`);
      const variants = variantRes.data;
      if (!variants.length) { toast.error("No variants available!"); return; }
      await API.post("/cart/add", { userId, productId, variantId: variants[0].id, quantity: 1 });
      loadCartCount();
      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh", bgcolor: T.black, fontFamily: DM,
      background: `
        radial-gradient(ellipse at 75% 0%, rgba(233,185,73,.06) 0%, transparent 55%),
        radial-gradient(ellipse at 15% 80%, rgba(208,49,45,.04) 0%, transparent 50%),
        ${T.black}
      `,
    }}>

      {/* Header */}
      <Box sx={{
        px: { xs: 2, sm: 4, md: 6, lg: 8 },
        pt: { xs: 4, sm: 5 }, pb: { xs: 3, sm: 4 },
        borderBottom: `1px solid ${T.border}`,
        background: `linear-gradient(180deg, rgba(233,185,73,.03) 0%, transparent 100%)`,
      }}>
        <Box sx={{ maxWidth: 1400, mx: "auto" }}>
          <Box sx={{
            display: "inline-flex", alignItems: "center", gap: .8,
            px: 1.4, py: .5, bgcolor: T.goldDim, border: `1px solid ${T.goldRim}`,
            borderRadius: "6px", mb: 2,
          }}>
            <LocalFireDepartmentIcon sx={{ fontSize: 12, color: T.gold }} />
            <Box sx={{ fontFamily: SYNE, fontWeight: 700, fontSize: 10, letterSpacing: "1.8px", textTransform: "uppercase", color: T.gold }}>
              Live Deals
            </Box>
          </Box>

          <Box sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" }, gap: 2,
          }}>
            <Box>
              <Box sx={{ fontFamily: SYNE, fontWeight: 800, fontSize: { xs: 26, sm: 34, md: 40 }, color: "#fff", lineHeight: 1.05, mb: .5 }}>
                Explore <Box component="span" sx={{ color: T.gold }}>Products</Box>
              </Box>
              {!loading && (
                <Box sx={{ fontFamily: DM, fontSize: 13, color: T.muted }}>
                  {products.length} products available
                </Box>
              )}
            </Box>

            {/* Grid / List toggle */}
            <Box sx={{ display: "flex", bgcolor: T.card, border: `1px solid ${T.border}`, borderRadius: "10px", p: .5, gap: .5, flexShrink: 0 }}>
              {[
                { mode: "grid", icon: <GridViewIcon sx={{ fontSize: 17 }} /> },
                { mode: "list", icon: <ViewListIcon sx={{ fontSize: 17 }} /> },
              ].map(({ mode, icon }) => (
                <Box
                  key={mode} component="button" onClick={() => setView(mode)}
                  sx={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 36, height: 36, borderRadius: "8px",
                    bgcolor: view === mode ? T.gold : "transparent", border: "none",
                    color: view === mode ? "#000" : T.muted2,
                    cursor: "pointer", transition: "all .18s",
                    "&:hover": view !== mode ? { color: T.text, bgcolor: "rgba(255,255,255,.05)" } : {},
                  }}
                >
                  {icon}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Products */}
      <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 }, py: { xs: 3, sm: 4 }, maxWidth: 1400, mx: "auto" }}>

        {loading && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(2,1fr)", md: "repeat(3,1fr)", lg: "repeat(4,1fr)" }, gap: { xs: 1.5, sm: 2.5 } }}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </Box>
        )}

        {!loading && view === "grid" && (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(2,1fr)", md: "repeat(3,1fr)", lg: "repeat(4,1fr)" }, gap: { xs: 1.5, sm: 2.5 }, alignItems: "stretch" }}>
            {products.map((p, idx) => <GridCard key={p.productId} p={p} idx={idx} onAddToCart={handleAddToCart} />)}
          </Box>
        )}

        {!loading && view === "list" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
            {products.map((p, idx) => <ListCard key={p.productId} p={p} idx={idx} onAddToCart={handleAddToCart} />)}
          </Box>
        )}

        {!loading && products.length === 0 && (
          <Box sx={{ textAlign: "center", py: 14, bgcolor: T.card, border: `1px solid ${T.border}`, borderRadius: "16px" }}>
            <Box sx={{ fontFamily: SYNE, fontWeight: 700, fontSize: 20, color: T.text, mb: 1 }}>No products found</Box>
            <Box sx={{ fontFamily: DM, fontSize: 13, color: T.muted }}>Check back soon for new deals</Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}