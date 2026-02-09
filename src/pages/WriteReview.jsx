import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

// MUI
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

export default function WriteReview() {
  const { productId, orderNumber } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const submitReview = async () => {
    const userId = localStorage.getItem("userId");

    if (!rating || !review.trim()) {
      alert("Please give rating and review");
      return;
    }

    await API.post("/reviews", {
      productId,
      orderNumber,
      userId,
      rating,
      reviewText: review
    });

    alert("Review submitted successfully");
    navigate("/orders/My");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Write a Review</h2>

      {/* ⭐ MUI STAR RATING */}
      <Rating
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
        size="large"
        precision={1}
        icon={<StarIcon fontSize="inherit" />}
        emptyIcon={<StarIcon fontSize="inherit" />}
      />

      {/* Rating Text */}
      <p className="text-sm text-gray-600 mt-1">
        {rating === 5 && "Excellent"}
        {rating === 4 && "Very Good"}
        {rating === 3 && "Good"}
        {rating === 2 && "Average"}
        {rating === 1 && "Poor"}
      </p>

      {/* REVIEW TEXT */}
      <textarea
        rows="5"
        className="w-full border rounded p-3 mt-4"
        placeholder="Write your review here..."
        value={review}
        onChange={e => setReview(e.target.value)}
      />

      {/* SUBMIT */}
      <button
        onClick={submitReview}
        className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
      >
        Submit Review
      </button>
    </div>
  );
}
