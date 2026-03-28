import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Rating,
  IconButton,
  Chip,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, ArrowBack } from "@mui/icons-material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReplayIcon from "@mui/icons-material/Replay";
import LockIcon from "@mui/icons-material/Lock";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api/axiosInstance";
import { useCart } from "../services/CartContext";
import WishlistDrawer from "../pages/WishlistDrawer";

/* ── brand tokens (matches Home.jsx exactly) ── */
const T = {
  black:   "#080808",
  surface: "#111111",
  card:    "#141414",
  border:  "#1e1e1e",
  gold:    "#E9B949",
  goldHov: "#f5c84e",
  red:     "#D0312D",
  text:    "#e2e2e2",
  muted:   "#666666",
  green:   "#4ade80",
};

const SYNE = "'Syne', sans-serif";
const DM   = "'DM Sans', sans-serif";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { loadCartCount } = useCart();

  const [openWish, setOpenWish]         = useState(false);
  const [page, setPage]                 = useState(null);
  const [activeImage, setActiveImage]   = useState(null);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [activeVariant, setActiveVariant] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [pricing, setPricing]           = useState(null);
  const [addedToCart, setAddedToCart]   = useState(false);

  const userId = localStorage.getItem("userId");

  /* ── fetch pricing when variant changes ── */
  useEffect(() => {
    if (!activeVariant) { setPricing(null); return; }
    API.get(`/variants/${activeVariant.id}/pricing`)
      .then(res => setPricing(res.data))
      .catch(() => setPricing(null));
  }, [activeVariant]);

  /* ── fetch product page ── */
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${productId}/page`)
      .then(res => {
        setPage(res.data);
        setActiveImage(res.data.images?.[0]?.imageUrl || null);
      });
  }, [productId]);

  /* ── resolve active variant from selected attributes ── */
  useEffect(() => {
    if (!page) return;
    const { variants = [], attributes = [], images = [] } = page;
    if (Object.keys(selectedAttrs).length !== attributes.length) {
      setActiveVariant(null);
      setActiveImage(images?.[0]?.imageUrl || null);
      return;
    }
    const match = variants.find(v =>
      Object.entries(selectedAttrs).every(
        ([attrId, valId]) => v.attributes?.[attrId] === valId
      )
    );
    setActiveVariant(match || null);
    setActiveImage(
      match?.images?.length > 0
        ? match.images[0].imageUrl
        : images?.[0]?.imageUrl || null
    );
  }, [selectedAttrs, page]);

  if (!page) return (
    <Box sx={{ bgcolor: T.black, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Typography sx={{ fontFamily: SYNE, color: T.gold, fontSize: 18 }}>Loading…</Typography>
    </Box>
  );

  const {
    name,
    brandName,
    breadcrumb = [],
    images = [],
    variants = [],
    attributes = [],
    features = [],
    specifications = [],
    additionalInfo = [],
    videos = [],
    manufacturerInfo,
    ratingSummary,
    reviews = [],
  } = page;

  const displayImages =
    activeVariant?.images?.length > 0 ? activeVariant.images : images;

  const carouselItems = [
    ...images.map(img => ({ type: "image", url: img.imageUrl })),
    videos[0] ? { type: "video", url: videos[0].videoUrl } : null,
  ].filter(Boolean);

  const nextSlide = () => setCarouselIndex(p => (p + 1) % carouselItems.length);
  const prevSlide = () => setCarouselIndex(p => p === 0 ? carouselItems.length - 1 : p - 1);

  const getAutoplayUrl = (url) => {
    if (!url.includes("youtube") && !url.includes("youtu.be")) return url;
    return url.replace("watch?v=", "embed/")
      + "?autoplay=1&mute=1&controls=0&loop=1&playlist="
      + url.split("watch?v=")[1];
  };

  const handleAddToCart = async () => {
    await API.post("/cart/add", {
      userId,
      productId: Number(productId),
      variantId: activeVariant.id,
      quantity: 1,
    });
    loadCartCount();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  /* ── discount % helper ── */
  const discountPct = pricing?.discount > 0
    ? Math.round((pricing.discount / pricing.mrp) * 100)
    : null;

  return (
    <Box sx={{ bgcolor: T.black, minHeight: "100vh", fontFamily: DM, color: T.text }}>

      {/* ── BREADCRUMB BAR ── */}
      <Box sx={{
        bgcolor: T.surface,
        borderBottom: `1px solid ${T.border}`,
        px: { xs: 2, md: 4 },
        py: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}>
        <IconButton
          onClick={() => navigate(-1)}
          size="small"
          sx={{ color: T.muted, "&:hover": { color: T.gold }, p: 0.5 }}
        >
          <ArrowBack fontSize="small" />
        </IconButton>
        <Typography sx={{ fontSize: 12, color: T.muted, letterSpacing: ".4px" }}>
          {breadcrumb.map(b => b.name).join(" › ")}
        </Typography>
      </Box>

      {/* ── MAIN PRODUCT SECTION ── */}
      <Box sx={{
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 5 },
        display: "flex",
        gap: { xs: 0, md: 5 },
        flexDirection: { xs: "column", md: "row" },
      }}>

        {/* ══════════════ LEFT — IMAGES ══════════════ */}
        <Box sx={{ display: "flex", gap: 2, flex: "0 0 52%", alignItems: "flex-start" }}>

          {/* Thumbnails */}
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.2,
            maxHeight: "70vh",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}>
            {displayImages.map((img, i) => (
              <Box
                key={i}
                onMouseEnter={() => setActiveImage(img.imageUrl)}
                sx={{
                  width: 64,
                  height: 64,
                  flexShrink: 0,
                  border: activeImage === img.imageUrl
                    ? `2px solid ${T.gold}`
                    : `1px solid ${T.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  bgcolor: T.card,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  transition: "border-color .2s",
                  "&:hover": { borderColor: "rgba(233,185,73,.5)" },
                }}
              >
                <img src={img.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </Box>
            ))}
          </Box>

          {/* Main image */}
          <Box sx={{
            flex: 1,
            height: "70vh",
            border: `1px solid ${T.border}`,
            borderRadius: "14px",
            bgcolor: T.card,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}>
            {activeImage && (
              <img
                src={activeImage}
                alt={name}
                style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain", transition: "opacity .25s" }}
              />
            )}
            {/* subtle glow overlay */}
            <Box sx={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse at 50% 50%, rgba(233,185,73,.04) 0%, transparent 70%)",
            }} />
          </Box>
        </Box>

        {/* ══════════════ RIGHT — DETAILS ══════════════ */}
        <Box sx={{
          flex: 1,
          height: { md: "70vh" },
          overflowY: { md: "auto" },
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          pt: { xs: 3, md: 0 },
        }}>

          {/* Brand */}
          <Typography sx={{
            fontFamily: SYNE,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "1.6px",
            textTransform: "uppercase",
            color: T.gold,
            mb: 1,
          }}>
            {brandName}
          </Typography>

          {/* Product name */}
          <Typography sx={{
            fontFamily: SYNE,
            fontWeight: 800,
            fontSize: { xs: "22px", md: "28px" },
            color: "#fff",
            lineHeight: 1.2,
            mb: 1.5,
          }}>
            {name}
          </Typography>

          {/* Rating */}
          {ratingSummary && ratingSummary.totalReviews > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Rating
                value={ratingSummary.averageRating}
                precision={0.1}
                readOnly
                size="small"
                sx={{ "& .MuiRating-iconFilled": { color: T.gold } }}
              />
              <Typography sx={{ fontSize: 13, color: T.muted }}>
                {ratingSummary.averageRating} ({ratingSummary.totalReviews} ratings)
              </Typography>
            </Box>
          )}

          <Box sx={{ height: "1px", bgcolor: T.border, my: 2 }} />

          {/* ── PRICE BLOCK ── */}
          {activeVariant && pricing ? (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, flexWrap: "wrap" }}>
                <Typography sx={{
                  fontFamily: SYNE,
                  fontSize: 32,
                  fontWeight: 800,
                  color: T.gold,
                  lineHeight: 1,
                }}>
                  ₹{pricing.finalPrice.toLocaleString("en-IN")}
                </Typography>

                {pricing.discount > 0 && (
                  <>
                    <Typography sx={{ fontSize: 16, color: T.muted, textDecoration: "line-through" }}>
                      ₹{pricing.mrp.toLocaleString("en-IN")}
                    </Typography>
                    <Box sx={{
                      bgcolor: T.red,
                      color: "#fff",
                      px: 1,
                      py: "2px",
                      borderRadius: "4px",
                      fontFamily: SYNE,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: ".8px",
                    }}>
                      {discountPct}% OFF
                    </Box>
                  </>
                )}
              </Box>
              <Typography sx={{ fontSize: 12, color: T.muted, mt: 0.5 }}>
                Inclusive of all taxes
              </Typography>
            </Box>
          ) : activeVariant ? (
            <Typography sx={{ fontSize: 16, color: T.muted, mb: 2 }}>Checking price…</Typography>
          ) : Object.keys(selectedAttrs).length === attributes.length ? (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: T.red, fontSize: 16, fontWeight: 700, fontFamily: SYNE }}>
                Currently unavailable
              </Typography>
              <Typography sx={{ fontSize: 13, color: T.muted, mt: 0.5 }}>
                This combination is not offered. Please choose another option.
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ fontSize: 16, color: T.muted, mb: 2, fontStyle: "italic" }}>
              Select all options to see price
            </Typography>
          )}

          {/* ── ATTRIBUTES ── */}
          {attributes.map(attr => (
            <Box key={attr.id} sx={{ mb: 2.5 }}>
              <Typography sx={{
                fontFamily: SYNE,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: T.muted,
                mb: 1,
              }}>
                {attr.name}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {attr.values.map(val => {
                  const isSelected = selectedAttrs[attr.id] === val.id;
                  return (
                    <Box
                      key={val.id}
                      onClick={() => setSelectedAttrs(prev => ({ ...prev, [attr.id]: val.id }))}
                      sx={{
                        px: 2,
                        py: 0.8,
                        borderRadius: "8px",
                        border: isSelected
                          ? `1.5px solid ${T.gold}`
                          : `1.5px solid ${T.border}`,
                        bgcolor: isSelected ? "rgba(233,185,73,.1)" : T.card,
                        color: isSelected ? T.gold : T.text,
                        fontFamily: DM,
                        fontSize: 13,
                        fontWeight: isSelected ? 700 : 400,
                        cursor: "pointer",
                        transition: "all .2s",
                        "&:hover": {
                          borderColor: "rgba(233,185,73,.5)",
                          color: T.gold,
                        },
                      }}
                    >
                      {val.value}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}

          <Box sx={{ height: "1px", bgcolor: T.border, my: 2.5 }} />

          {/* ── TRUST BADGES ── */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            {[
              { icon: <LocalShippingIcon sx={{ fontSize: 16 }} />, label: "Free Delivery" },
              { icon: <LockIcon sx={{ fontSize: 16 }} />,          label: "Secure Payment" },
              { icon: <ReplayIcon sx={{ fontSize: 16 }} />,        label: "7-Day Returns" },
            ].map(b => (
              <Box key={b.label} sx={{
                display: "flex", alignItems: "center", gap: 0.7,
                color: T.muted, fontSize: 12,
              }}>
                <Box sx={{ color: T.gold }}>{b.icon}</Box>
                <Typography sx={{ fontSize: 12, color: T.muted }}>{b.label}</Typography>
              </Box>
            ))}
          </Box>

          {/* ── CTA BUTTONS ── */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button
              variant="contained"
              disabled={!activeVariant}
              onClick={handleAddToCart}
              sx={{
                bgcolor: addedToCart ? T.green : T.gold,
                color: "#000",
                fontFamily: SYNE,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: ".8px",
                textTransform: "uppercase",
                borderRadius: "8px",
                py: 1.5,
                boxShadow: addedToCart
                  ? "0 4px 20px rgba(74,222,128,.25)"
                  : "0 4px 20px rgba(233,185,73,.25)",
                "&:hover": {
                  bgcolor: addedToCart ? T.green : T.goldHov,
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 28px rgba(233,185,73,.35)",
                },
                "&:disabled": { bgcolor: T.border, color: T.muted },
                transition: "all .2s",
              }}
            >
              {addedToCart ? "✓ Added to Cart!" : activeVariant ? "Add to Cart" : "Select an Option"}
            </Button>

            <Button
              variant="outlined"
              onClick={async () => {
                await API.post("/wishlist/add", {
                  userId,
                  productId: Number(productId),
                });
                setOpenWish(true);
              }}
              sx={{
                color: T.text,
                fontFamily: SYNE,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: ".8px",
                textTransform: "uppercase",
                borderRadius: "8px",
                py: 1.5,
                border: `1.5px solid ${T.border}`,
                "&:hover": {
                  borderColor: T.gold,
                  color: T.gold,
                  bgcolor: "rgba(233,185,73,.05)",
                },
                transition: "all .2s",
              }}
            >
              💙 Add to Wishlist
            </Button>
          </Box>

          <WishlistDrawer open={openWish} onClose={() => setOpenWish(false)} userId={userId} />

          {/* ── FEATURES ── */}
          {features.length > 0 && (
            <>
              <Box sx={{ height: "1px", bgcolor: T.border, my: 3 }} />
              <Typography sx={{ fontFamily: SYNE, fontSize: 13, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: T.muted, mb: 1.5 }}>
                Features
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                {features.map((f, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                    <Box sx={{ color: T.gold, mt: "3px", fontSize: 14, flexShrink: 0 }}>▸</Box>
                    <Typography sx={{ fontSize: 14, color: T.text, lineHeight: 1.6 }}>{f.feature}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* ── SPECIFICATIONS ── */}
          {specifications.length > 0 && (
            <>
              <Box sx={{ height: "1px", bgcolor: T.border, my: 3 }} />
              <Typography sx={{ fontFamily: SYNE, fontSize: 13, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: T.muted, mb: 1.5 }}>
                Specifications
              </Typography>
              <Box sx={{ border: `1px solid ${T.border}`, borderRadius: "10px", overflow: "hidden" }}>
                {specifications.map((s, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      borderBottom: i < specifications.length - 1 ? `1px solid ${T.border}` : "none",
                    }}
                  >
                    <Box sx={{
                      width: "42%",
                      px: 2,
                      py: 1.2,
                      bgcolor: "rgba(255,255,255,.02)",
                      borderRight: `1px solid ${T.border}`,
                    }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: T.muted }}>{s.specKey}</Typography>
                    </Box>
                    <Box sx={{ width: "58%", px: 2, py: 1.2 }}>
                      <Typography sx={{ fontSize: 13, color: T.text }}>{s.specValue}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* ── MANUFACTURER INFO + CAROUSEL ── */}
      {(manufacturerInfo?.content || carouselItems.length > 0) && (
        <Box sx={{
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 2, md: 4 },
          pb: { xs: 4, md: 6 },
        }}>
          <Box sx={{ height: "1px", bgcolor: T.border, mb: 4 }} />

          {manufacturerInfo?.content && (
            <Typography sx={{
              fontSize: 15,
              color: T.muted,
              lineHeight: 1.8,
              whiteSpace: "pre-line",
              mb: 3,
            }}>
              {manufacturerInfo.content}
            </Typography>
          )}

          {carouselItems.length > 0 && (
            <Box sx={{
              width: "100%",
              height: { xs: 260, md: 480 },
              position: "relative",
              border: `1px solid ${T.border}`,
              borderRadius: "14px",
              overflow: "hidden",
              bgcolor: T.card,
            }}>
              {carouselItems[carouselIndex].type === "image" ? (
                <img
                  src={carouselItems[carouselIndex].url}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <iframe
                  width="100%"
                  height="100%"
                  src={getAutoplayUrl(carouselItems[carouselIndex].url)}
                  frameBorder="0"
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                />
              )}

              {/* nav buttons */}
              {[
                { side: "left",  fn: prevSlide, icon: <ArrowBackIos fontSize="small" /> },
                { side: "right", fn: nextSlide, icon: <ArrowForwardIos fontSize="small" /> },
              ].map(btn => (
                <IconButton
                  key={btn.side}
                  onClick={btn.fn}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    [btn.side]: 12,
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(20,20,20,.8)",
                    border: `1px solid ${T.border}`,
                    color: T.text,
                    "&:hover": { bgcolor: T.gold, color: "#000" },
                    transition: "all .2s",
                  }}
                >
                  {btn.icon}
                </IconButton>
              ))}

              {/* dot indicators */}
              <Box sx={{
                position: "absolute",
                bottom: 14,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 1,
              }}>
                {carouselItems.map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    sx={{
                      width: i === carouselIndex ? 20 : 6,
                      height: 6,
                      borderRadius: "3px",
                      bgcolor: i === carouselIndex ? T.gold : T.muted,
                      cursor: "pointer",
                      transition: "all .3s",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* ── ADDITIONAL INFO ── */}
      {additionalInfo.length > 0 && (
        <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 }, pb: { xs: 4, md: 6 } }}>
          <Box sx={{ height: "1px", bgcolor: T.border, mb: 4 }} />
          <Typography sx={{ fontFamily: SYNE, fontSize: 16, fontWeight: 800, color: "#fff", mb: 2 }}>
            Additional <Box component="span" sx={{ color: T.gold }}>Information</Box>
          </Typography>
          <Box sx={{ border: `1px solid ${T.border}`, borderRadius: "10px", overflow: "hidden" }}>
            {additionalInfo.map((info, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  borderBottom: i < additionalInfo.length - 1 ? `1px solid ${T.border}` : "none",
                }}
              >
                <Box sx={{
                  width: "38%",
                  px: 2, py: 1.2,
                  bgcolor: "rgba(255,255,255,.02)",
                  borderRight: `1px solid ${T.border}`,
                }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: T.muted }}>{info.infoKey}</Typography>
                </Box>
                <Box sx={{ width: "62%", px: 2, py: 1.2 }}>
                  <Typography sx={{ fontSize: 13, color: T.text }}>{info.infoValue}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ── CUSTOMER REVIEWS ── */}
      {reviews.length > 0 && (
        <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 }, pb: { xs: 6, md: 8 } }}>
          <Box sx={{ height: "1px", bgcolor: T.border, mb: 4 }} />

          <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 1 }}>
            <Typography sx={{ fontFamily: SYNE, fontSize: 20, fontWeight: 800, color: "#fff" }}>
              Customer <Box component="span" sx={{ color: T.gold }}>Reviews</Box>
            </Typography>
            {ratingSummary && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Rating
                  value={ratingSummary.averageRating}
                  precision={0.1}
                  readOnly
                  size="small"
                  sx={{ "& .MuiRating-iconFilled": { color: T.gold } }}
                />
                <Typography sx={{ fontSize: 13, color: T.muted }}>
                  {ratingSummary.averageRating} out of 5 · {ratingSummary.totalReviews} reviews
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 2,
          }}>
            {reviews.map((r, i) => (
              <Box
                key={i}
                sx={{
                  bgcolor: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: "12px",
                  p: 2.5,
                  transition: "border-color .2s, transform .2s",
                  "&:hover": {
                    borderColor: "rgba(233,185,73,.3)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Rating
                  value={r.rating}
                  readOnly
                  size="small"
                  sx={{ "& .MuiRating-iconFilled": { color: T.gold }, mb: 1 }}
                />
                <Typography sx={{ fontSize: 14, color: T.text, lineHeight: 1.6, mb: 1.5 }}>
                  {r.reviewText}
                </Typography>
                <Typography sx={{ fontSize: 11, color: T.muted, letterSpacing: ".3px" }}>
                  {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

    </Box>
  );
}