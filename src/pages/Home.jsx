import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid bg-light p-4">

      {/* Hero */}
      <div className="bg-primary text-white p-5 rounded mb-4 text-center">
        <h1>Welcome to ShopKart</h1>
        <p>India's trusted online shopping destination</p>
        <button
          className="btn btn-warning fw-bold"
          onClick={() => navigate("/products")}
        >
          Shop Now
        </button>
      </div>

      {/* Categories */}
      <div className="row text-center mb-4">
        {["Mobiles", "Electronics", "Fashion"].map(c => (
          <div
            key={c}
            className="col-md"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/products")}
          >
            <div className="card shadow-sm p-3">
              <h6>{c}</h6>
            </div>
          </div>
        ))}
      </div>

      {/* Products */}
      <h4 className="mb-3">Deals for You</h4>
      <div className="row">
        {[1,2,3,4].map(id => (
          <div key={id} className="col-md-3 mb-4">
            <div
              className="card shadow-sm h-100"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/product/${id}`)}
            >
              <div className="card-body text-center">
                <div className="bg-secondary mb-3" style={{height:120}} />
                <h6>Product Name</h6>
                <p className="fw-bold text-success">₹999</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
