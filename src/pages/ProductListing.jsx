import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, CircularProgress
} from "@mui/material";
import API from "../api/axiosInstance";
import { useCart } from "../services/CartContext";

/* ── theme tokens (same as auth pages) ── */
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
};

const SYNE = "'Syne', sans-serif";
const DM = "'DM Sans', sans-serif";

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { loadCartCount } = useCart();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const variantRes = await axios.get(
        `http://localhost:8080/api/products/${productId}/variants`
      );

      const variants = variantRes.data;

      if (!variants.length) {
        toast.success("No variants available!");
        return;
      }

      const defaultVariant = variants[0];

      await API.post("/cart/add", {
        userId,
        productId,
        variantId: defaultVariant.id,
        quantity: 1
      });

      loadCartCount();
      toast.success("Added to cart");

    } catch (err) {
      console.error(err);
      toast.success("Failed to add to cart");
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: T.black,
      px: { xs: 2, md: 4 },
      py: 4,
      fontFamily: DM,
      background: `radial-gradient(ellipse at 60% 0%, rgba(233,185,73,.07) 0%, transparent 60%),
                   ${T.black}`,
    }}>

      {/* Page Title */}
      <Typography sx={{
        fontFamily: SYNE,
        fontSize: 28,
        fontWeight: 800,
        color: "#fff",
        mb: 3
      }}>
        Explore Products
      </Typography>

      {/* Loader */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress sx={{ color: T.gold }} />
        </Box>
      ) : (

        <Box sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)"
          },
          gap: 3
        }}>

          {products.map((p) => (
            <Box
              key={p.productId}
              onClick={() => navigate(`/product/${p.productId}`)}
              sx={{
                bgcolor: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all .25s",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,.6)",
                  borderColor: T.gold,
                }
              }}
            >

              {/* Image */}
              <Box sx={{
                height: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: T.card,
                p: 2
              }}>
                <Box
                  component="img"
                  src={p.image || "/placeholder.png"}
                  sx={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain"
                  }}
                />
              </Box>

              {/* Content */}
              <Box sx={{ p: 2, flexGrow: 1 }}>
                <Typography sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  mb: 0.5
                }}>
                  {p.name}
                </Typography>

                <Typography sx={{
                  color: T.muted,
                  fontSize: 12,
                  mb: 1
                }}>
                  {p.brand}
                </Typography>

                <Typography sx={{
                  color: T.gold,
                  fontWeight: 700,
                  fontSize: 16
                }}>
                  ₹{p.price}
                </Typography>

                <Typography sx={{
                  fontSize: 12,
                  color: T.muted,
                  mt: 0.5
                }}>
                  ⭐ {p.rating || "No rating"}
                </Typography>
              </Box>

              {/* Button */}
              <Box sx={{ p: 2 }}>
                <Box
                  component="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(p.productId);
                  }}
                  sx={{
                    width: "100%",
                    bgcolor: T.gold,
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    py: "10px",
                    fontFamily: SYNE,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: ".2s",
                    "&:hover": {
                      bgcolor: T.goldHov,
                      transform: "translateY(-1px)"
                    }
                  }}
                >
                  Add to Cart
                </Box>
              </Box>

            </Box>
          ))}

        </Box>
      )}
    </Box>
  );
}
