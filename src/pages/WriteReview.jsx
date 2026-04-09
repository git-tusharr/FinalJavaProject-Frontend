import { toast } from "react-toastify";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import { Box, CircularProgress } from "@mui/material";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import RateReviewIcon from "@mui/icons-material/RateReview";

/* ── Brand tokens ── */
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
  text:    "#e2e2e2",
  muted:   "#555555",
  muted2:  "#888888",
};
const SYNE = "'Syne', sans-serif";
const DM   = "'DM Sans', sans-serif";

const RATING_LABELS = {
  1: { text: "Poor",      color: T.red },
  2: { text: "Average",   color: "#f97316" },
  3: { text: "Good",      color: "#eab308" },
  4: { text: "Very Good", color: "#84cc16" },
  5: { text: "Excellent", color: "#4ade80" },
};

export default function WriteReview() {
  const { productId, orderNumber } = useParams();
  const navigate = useNavigate();

  const [rating, setRating]   = useState(0);
  const [review, setReview]   = useState("");
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(0);

  const activeLabel = RATING_LABELS[hovered || rating];

  const submitReview = async () => {
    const userId = localStorage.getItem("userId");

    if (!rating || !review.trim()) {
      toast.error("Please give a rating and write a review");
      return;
    }

    try {
      setLoading(true);
      await API.post("/reviews", {
        productId,
        orderNumber,
        userId,
        rating,
        reviewText: review,
      });
      toast.success("Review submitted successfully!");
      navigate("/orders/my");
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: T.black,
      fontFamily: DM,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: 2, py: 6,
      background: `
        radial-gradient(ellipse at 65% 0%, rgba(233,185,73,.06) 0%, transparent 55%),
        radial-gradient(ellipse at 20% 100%, rgba(208,49,45,.05) 0%, transparent 50%),
        ${T.black}
      `,
    }}>
      <Box sx={{
        width: "100%",
        maxWidth: 520,
        bgcolor: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,.6)",
      }}>

        {/* Top gradient bar */}
        <Box sx={{
          height: 3,
          background: `linear-gradient(90deg, ${T.red}, ${T.gold})`,
        }} />

        <Box sx={{ p: { xs: 3, sm: 4 } }}>

          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: "11px",
              bgcolor: T.goldDim, border: `1px solid ${T.goldRim}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <RateReviewIcon sx={{ fontSize: 20, color: T.gold }} />
            </Box>
            <Box>
              <Box sx={{
                fontFamily: SYNE, fontWeight: 800, fontSize: 20, color: "#fff", lineHeight: 1,
              }}>
                Write a{" "}
                <Box component="span" sx={{ color: T.gold }}>Review</Box>
              </Box>
              <Box sx={{ fontFamily: DM, fontSize: 12, color: T.muted, mt: "3px" }}>
                Share your experience with this product
              </Box>
            </Box>
          </Box>

          {/* ── Star rating ── */}
          <Box sx={{
            bgcolor: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: "12px",
            p: 3, mb: 2.5,
            textAlign: "center",
          }}>
            <Box sx={{
              fontFamily: SYNE, fontSize: 11, fontWeight: 700,
              letterSpacing: "1.6px", textTransform: "uppercase",
              color: T.muted, mb: 2,
            }}>
              Your Rating
            </Box>

            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              onChangeActive={(_, newHover) => setHovered(newHover)}
              size="large"
              precision={1}
              icon={
                <StarIcon sx={{ fontSize: 40, color: T.gold, filter: "drop-shadow(0 0 6px rgba(233,185,73,.4))" }} />
              }
              emptyIcon={
                <StarBorderIcon sx={{ fontSize: 40, color: T.muted }} />
              }
              sx={{
                "& .MuiRating-icon": { mx: .3 },
              }}
            />

            {/* Rating label */}
            <Box sx={{
              mt: 1.5, height: 24,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {activeLabel ? (
                <Box sx={{
                  fontFamily: SYNE, fontWeight: 700, fontSize: 13,
                  color: activeLabel.color,
                  px: 2, py: .4,
                  bgcolor: `${activeLabel.color}14`,
                  border: `1px solid ${activeLabel.color}30`,
                  borderRadius: "6px",
                  letterSpacing: ".4px",
                }}>
                  {activeLabel.text}
                </Box>
              ) : (
                <Box sx={{ fontFamily: DM, fontSize: 13, color: T.muted }}>
                  Tap a star to rate
                </Box>
              )}
            </Box>
          </Box>

          {/* ── Review textarea ── */}
          <Box sx={{ mb: 2.5 }}>
            <Box sx={{
              fontFamily: SYNE, fontSize: 11, fontWeight: 700,
              letterSpacing: "1.4px", textTransform: "uppercase",
              color: T.muted, mb: 1.2,
            }}>
              Your Review
            </Box>
            <Box
              component="textarea"
              rows={5}
              placeholder="What did you like or dislike? How was the quality?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              sx={{
                width: "100%",
                bgcolor: T.card,
                border: `1.5px solid ${T.border}`,
                borderRadius: "10px",
                p: "14px 16px",
                fontFamily: DM, fontSize: 14, color: T.text,
                resize: "vertical",
                outline: "none",
                transition: "border-color .2s, box-shadow .2s",
                boxSizing: "border-box",
                lineHeight: 1.6,
                "&::placeholder": { color: T.muted },
                "&:focus": {
                  borderColor: T.gold,
                  boxShadow: "0 0 0 3px rgba(233,185,73,.08)",
                },
              }}
            />
            <Box sx={{
              display: "flex", justifyContent: "flex-end",
              fontFamily: DM, fontSize: 11, color: T.muted, mt: .8,
            }}>
              {review.length} characters
            </Box>
          </Box>

          {/* ── Submit button ── */}
          <Box
            component="button"
            onClick={submitReview}
            disabled={loading}
            sx={{
              width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
              py: "13px",
              bgcolor: loading ? T.border : T.gold,
              color: loading ? T.muted : "#000",
              border: "none", borderRadius: "10px",
              fontFamily: SYNE, fontWeight: 700, fontSize: 13,
              letterSpacing: ".8px", textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all .2s",
              "&:hover": !loading ? {
                bgcolor: T.goldHov,
                transform: "translateY(-2px)",
                boxShadow: "0 8px 28px rgba(233,185,73,.3)",
              } : {},
            }}
          >
            {loading
              ? <CircularProgress size={16} sx={{ color: T.muted }} />
              : <RateReviewIcon sx={{ fontSize: 17 }} />}
            {loading ? "Submitting…" : "Submit Review"}
          </Box>

          {/* Cancel */}
          <Box
            component="button"
            onClick={() => navigate(-1)}
            sx={{
              width: "100%", mt: 1.5,
              display: "flex", alignItems: "center", justifyContent: "center",
              py: "11px",
              bgcolor: "transparent",
              border: `1px solid ${T.border}`,
              borderRadius: "10px",
              fontFamily: DM, fontWeight: 500, fontSize: 13, color: T.muted,
              cursor: "pointer", transition: "all .18s",
              "&:hover": { borderColor: T.red, color: T.red, bgcolor: "rgba(208,49,45,.05)" },
            }}
          >
            Cancel
          </Box>

        </Box>
      </Box>
    </Box>
  );
}