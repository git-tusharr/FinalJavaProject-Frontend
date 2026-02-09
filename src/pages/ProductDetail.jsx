import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Rating,
  IconButton
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import axios from "axios";
import API from "../api/axiosInstance";
import { useCart } from "../services/CartContext";
import WishlistDrawer from "../pages/WishlistDrawer";

export default function ProductDetail() {
  const { productId } = useParams();
  const { loadCartCount } = useCart();
const [openWish, setOpenWish] = useState(false);
  const [page, setPage] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedAttrs, setSelectedAttrs] = useState({});
  const [activeVariant, setActiveVariant] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [pricing, setPricing] = useState(null);

const userId = localStorage.getItem("userId");
useEffect(() => {
  if (!activeVariant) {
    setPricing(null);
    return;
  }

  API.get(`/variants/${activeVariant.id}/pricing`)
    .then(res => setPricing(res.data))
    .catch(() => setPricing(null));
}, [activeVariant]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${productId}/page`)
      .then(res => {
        setPage(res.data);
        setActiveImage(res.data.images?.[0]?.imageUrl || null);
      });
  }, [productId]);

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

  if (!page) return <Typography>Loading...</Typography>;

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
      reviews = [] 
  } = page;

  const displayImages =
    activeVariant?.images?.length > 0 ? activeVariant.images : images;

  // Build slide list = images + FIRST video
  const carouselItems = [
    ...images.map(img => ({ type: "image", url: img.imageUrl })),
    videos[0] ? { type: "video", url: videos[0].videoUrl } : null
  ].filter(Boolean);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  };

  const getAutoplayUrl = (url) => {
    if (!url.includes("youtube") && !url.includes("youtu.be")) return url;
    return url
      .replace("watch?v=", "embed/")
      + "?autoplay=1&mute=1&controls=0&loop=1&playlist="
      + url.split("watch?v=")[1];
  };

  return (
    <Box sx={{ px: 2, maxWidth: 1600, mx: "auto" }}>
      
      {/* =================== BREADCRUMB =================== */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {breadcrumb.map(b => b.name).join(" › ")}
      </Typography>

      <Box sx={{ display: "flex", gap: 3 }}>
        
        {/* =================== LEFT THUMBNAILS =================== */}
        <Box
          sx={{
            width: 90,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxHeight: "75vh",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" }
          }}
        >
          {displayImages.map((img, i) => (
            <Box
              key={i}
              onMouseEnter={() => setActiveImage(img.imageUrl)}
              sx={{
                width: 70,
                height: 70,
                border:
                  activeImage === img.imageUrl
                    ? "2px solid #f08804"
                    : "1px solid #ddd",
                cursor: "pointer",
                borderRadius: 1,
                backgroundColor: "#fff"
              }}
            >
              <img src={img.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </Box>
          ))}
        </Box>

        {/* =================== MAIN IMAGE =================== */}
        <Box
          sx={{
            flex: "0 0 45%",
            height: "75vh",
            border: "1px solid #ddd",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff"
          }}
        >
          {activeImage && (
            <img
              src={activeImage}
              alt={name}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          )}
        </Box>

        {/* =================== RIGHT SCROLL PANEL =================== */}
        <Box
          sx={{
            flex: "0 0 35%",
            height: "75vh",
            overflowY: "auto",
            pr: 2,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" }
          }}
        >
          <Typography variant="h5" fontWeight="bold">{name}</Typography>
          <Typography color="primary">Brand: {brandName}</Typography>


{/* =================== AVERAGE RATING =================== */}
{ratingSummary && ratingSummary.totalReviews > 0 && (
  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
    <Rating
      value={ratingSummary.averageRating}
      precision={0.1}
      readOnly
      size="small"
    />
    <Typography sx={{ ml: 1, fontSize: 14, color: "text.secondary" }}>
      {ratingSummary.averageRating} out of 5
    </Typography>
    <Typography sx={{ ml: 1, fontSize: 14, color: "text.secondary" }}>
      ({ratingSummary.totalReviews} ratings)
    </Typography>
  </Box>
)}


          {/* =================== REVIEWS =================== */}
{reviews.length > 0 && (
  <>
    <Divider sx={{ my: 3 }} />
    <Typography variant="h6" sx={{ mb: 2 }}>
      Customer Reviews
    </Typography>

    {reviews.map((r, i) => (
      <Box key={i} sx={{ mb: 2 }}>
        <Rating value={r.rating} readOnly size="small" />
        <Typography sx={{ mt: 0.5 }}>
          {r.reviewText}
        </Typography>
        <Typography
          sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}
        >
          Reviewed on {new Date(r.createdAt).toLocaleDateString()}
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>
    ))}
  </>
)}


          {/* =================== PRICE / AVAILABILITY =================== */}
          {/* {activeVariant ? (
            <Typography
              sx={{ mt: 2, fontSize: 24, fontWeight: "bold", color: "#B12704" }}
            >
              ₹{activeVariant.price}
            </Typography>
          ) : Object.keys(selectedAttrs).length === attributes.length ? (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ color: "error.main", fontSize: 18, fontWeight: "bold" }}>
                Currently unavailable
              </Typography>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                This combination is not offered. Please choose other options.
              </Typography>
            </Box>
          ) : (
            <Typography
              sx={{ mt: 2, fontSize: 20, fontWeight: "normal", color: "text.secondary" }}
            >
              Select all options to see price
            </Typography>
          )} */}
{/* =================== PRICE / DISCOUNT =================== */}
{activeVariant && pricing ? (
  <Box sx={{ mt: 2 }}>
    {/* Final Price */}
    <Typography
      sx={{ fontSize: 24, fontWeight: "bold", color: "#B12704" }}
    >
      ₹{pricing.finalPrice}
    </Typography>

    {/* Show MRP + % off only when discount exists */}
    {pricing.discount > 0 && (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
        <Typography
          sx={{
            textDecoration: "line-through",
            color: "text.secondary",
            fontSize: 16
          }}
        >
          ₹{pricing.mrp}
        </Typography>

        <Box
          sx={{
            background: "#CC0C39",
            color: "#fff",
            px: 1,
            fontSize: 12,
            borderRadius: 1,
            fontWeight: "bold"
          }}
        >
          {Math.round((pricing.discount / pricing.mrp) * 100)}% off
        </Box>
      </Box>
    )}

    <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
      Inclusive of all taxes
    </Typography>
  </Box>
) : activeVariant ? (
  // Variant selected but still loading pricing
  <Typography sx={{ mt: 2, fontSize: 20, color: "text.secondary" }}>
    Checking price…
  </Typography>
) : Object.keys(selectedAttrs).length === attributes.length ? (
  // All attributes selected but variant not found
  <Box sx={{ mt: 2 }}>
    <Typography sx={{ color: "error.main", fontSize: 18, fontWeight: "bold" }}>
      Currently unavailable
    </Typography>
    <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
      This combination is not offered. Please choose another option.
    </Typography>
  </Box>
) : (
  // Not all attributes selected
  <Typography
    sx={{ mt: 2, fontSize: 20, fontWeight: "normal", color: "text.secondary" }}
  >
    Select all options to see price
  </Typography>
)}

          {/* =================== ATTRIBUTES =================== */}
          {attributes.map(attr => (
            <Box key={attr.id} sx={{ mt: 2 }}>
              <Typography fontWeight="bold">{attr.name}</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                {attr.values.map(val => (
                  <Button
                    key={val.id}
                    size="small"
                    variant={selectedAttrs[attr.id] === val.id ? "contained" : "outlined"}
                    onClick={() =>
                      setSelectedAttrs(prev => ({ ...prev, [attr.id]: val.id }))
                    }
                  >
                    {val.value}
                  </Button>
                ))}
              </Box>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Features</Typography>
          {features.map((f, i) => <Typography key={i}>• {f.feature}</Typography>)}

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Specifications</Typography>
          {specifications.map((s, i) => (
            <Box key={i} sx={{ display: "flex", py: 0.7 }}>
              <Typography sx={{ width: "45%", fontWeight: "bold" }}>{s.specKey} :</Typography>
              <Typography sx={{ width: "55%" }}>{s.specValue}</Typography>
            </Box>
          ))}

           {/* ⭐ ADD TO CART */}
          <Button
            variant="contained"
            color="warning"
            disabled={!activeVariant}
            sx={{ mt: 3, width: "100%", fontSize: 16 }}
            onClick={async () => {
              await API.post("/cart/add", {
                userId,
          productId: Number(productId), 
           variantId: activeVariant.id,  
                quantity: 1,
              });
              loadCartCount();
              alert("Added to cart");
            }}
          >
            {activeVariant ? "Add to Cart" : "Select valid option"}
          </Button>

          {/* 💙 ADD TO WISHLIST */}
      
<Button
  variant="outlined"
  color="primary"
  sx={{ mt: 1, width: "100%", fontSize: 16 }}
  onClick={async () => {
    await API.post("/wishlist/add", {
      userId,
      productId: Number(productId),
    });
    setOpenWish(true); // 🎉 open drawer
  }}
>
  💙 Add to Wishlist
</Button>

<WishlistDrawer open={openWish} onClose={() => setOpenWish(false)} userId={userId} />
        </Box>
      </Box>

      {/* =================== MANUFACTURER (TEXT + CAROUSEL) =================== */}
      {manufacturerInfo?.content && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography sx={{ whiteSpace: "pre-line", mb: 2, fontSize: 16 }}>
            {manufacturerInfo.content}
          </Typography>
        </>
      )}

      {carouselItems.length > 0 && (
        <Box
          sx={{
            width: "100%",
            height: 500,
            my: 2,
            position: "relative",
            border: "1px solid #ddd",
            borderRadius: 2,
            overflow: "hidden",
            background: "#000"
          }}
        >
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

          <IconButton
            onClick={prevSlide}
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              bgcolor: "#fff"
            }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>

          <IconButton
            onClick={nextSlide}
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
              bgcolor: "#fff"
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* =================== ADDITIONAL INFO =================== */}
      {additionalInfo.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6">Additional Information</Typography>
          {additionalInfo.map((info, i) => (
            <Box key={i} sx={{ display: "flex", py: 0.6 }}>
              <Typography sx={{ width: "40%", fontWeight: "bold" }}>{info.infoKey} :</Typography>
              <Typography sx={{ width: "60%" }}>{info.infoValue}</Typography>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
