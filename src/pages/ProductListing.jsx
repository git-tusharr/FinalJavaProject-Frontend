import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import { useCart } from "../services/CartContext";
export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
    const { loadCartCount } = useCart();
const userId = localStorage.getItem("userId");



  useEffect(() => {
    axios
      .get("http://localhost:8080/api/products")
      .then(res => setProducts(res.data));
  }, []);

const handleAddToCart = async (productId) => {
  try {
    // 1️⃣ fetch variants for this product
    const variantRes = await axios.get(`http://localhost:8080/api/products/${productId}/variants`);
    const variants = variantRes.data;

    if (!variants.length) {
      alert("No variants available for this product!");
      return;
    }

    // 2️⃣ select first variant
    const defaultVariant = variants[0];

    // 3️⃣ add to cart with variantId
    await API.post("/cart/add", {
      userId,
      productId,
      variantId: defaultVariant.id,
      quantity: 1
    });
loadCartCount();
    alert("Added to cart");
  } catch (err) {
    console.error(err);
    alert("Failed to add to cart");
  }
};

  return (
    <div className="container mt-4">
      <div className="row">
        {products.map(p => (
          <div key={p.productId} className="col-md-3 mb-4">
            <div
              className="card h-100 shadow-sm d-flex flex-column"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/product/${p.productId}`)}
            >
              <img
                src={p.image || "/placeholder.png"}
                className="card-img-top"
                style={{ height: 180, objectFit: "contain" }}
              />

              <div className="card-body flex-grow-1">
                <h6>{p.name}</h6>
                <p className="text-muted">{p.brand}</p>
                <h5 className="text-success">₹{p.price}</h5>
                <small>⭐ {p.rating || "No rating"}</small>
              </div>

              <div className="card-footer bg-transparent border-0 p-2">
                <button
                  className="btn btn-warning w-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(p.productId);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
