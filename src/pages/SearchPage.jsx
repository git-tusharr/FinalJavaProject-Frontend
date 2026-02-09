import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

export default function SearchPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  // MULTIPLE filters now stored as arrays
  const [q, setQ] = useState(params.get("q") || "");
  const [brandIds, setBrandIds] = useState(params.getAll("brandId") || []);
  const [categoryIds, setCategoryIds] = useState(params.getAll("categoryId") || []);
  const [attributeIds, setAttributeIds] = useState(params.getAll("attributeValueId") || []);
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");

  const [results, setResults] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const updateURL = () => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);

    brandIds.forEach(id => p.append("brandId", id));
    categoryIds.forEach(id => p.append("categoryId", id));
    attributeIds.forEach(id => p.append("attributeValueId", id));

    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);

    navigate(`/search?${p.toString()}`);
  };

  const loadResults = async () => {
    const res = await API.get("/search", {
      params: {
        q,
        brandId: brandIds,
        categoryId: categoryIds,
        attributeValueId: attributeIds,
        minPrice,
        maxPrice,
      },
      paramsSerializer: (params) => {
        const search = new URLSearchParams();
        Object.keys(params).forEach(key => {
          const value = params[key];
          if (Array.isArray(value)) {
            value.forEach(v => search.append(key, v));
          } else if (value) {
            search.append(key, value);
          }
        });
        return search.toString();
      }
    });
    setResults(res.data);
  };

  const loadFilters = async () => {
    const b = await API.get("/search/brands");
    const c = await API.get("/search/categories");
    const a = await API.get("/search/attributes");
    setBrands(b.data);
    setCategories(c.data);
    setAttributes(a.data);
  };

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    updateURL();
    loadResults();
  }, [q, brandIds, categoryIds, attributeIds, minPrice, maxPrice]);

  const toggle = (id, stateSetter, list) => {
    stateSetter(
      list.includes(id) ? list.filter(x => x !== id) : [...list, id]
    );
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">

        {/* SIDEBAR */}
        <div className="col-md-3 border-end">
          <h5 className="fw-bold mb-3">Filters</h5>

          {/* SEARCH */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />

          {/* BRAND CHECKBOX */}
          <h6 className="mt-3">Brand</h6>
          {brands.map(b => (
            <div key={b.id}>
              <input
                type="checkbox"
                checked={brandIds.includes(String(b.id))}
                onChange={() => toggle(String(b.id), setBrandIds, brandIds)}
              />{" "}
              {b.name}
            </div>
          ))}

          {/* CATEGORY CHECKBOX */}
          <h6 className="mt-3">Category</h6>
          {categories.map(c => (
            <div key={c.id}>
              <input
                type="checkbox"
                checked={categoryIds.includes(String(c.id))}
                onChange={() => toggle(String(c.id), setCategoryIds, categoryIds)}
              />{" "}
              {c.name}
            </div>
          ))}

          {/* ATTRIBUTE CHECKBOX */}
          <h6 className="mt-3">Attributes</h6>
          {attributes.map(a => (
            <div key={a.id}>
              <input
                type="checkbox"
                checked={attributeIds.includes(String(a.id))}
                onChange={() => toggle(String(a.id), setAttributeIds, attributeIds)}
              />{" "}
              {a.value}
            </div>
          ))}

          {/* PRICE */}
          <h6 className="mt-3">Price</h6>
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Min"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Max"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />

          <button
            className="btn btn-outline-danger w-100 mt-2"
            onClick={() => {
              setQ("");
              setBrandIds([]);
              setCategoryIds([]);
              setAttributeIds([]);
              setMinPrice("");
              setMaxPrice("");
            }}
          >
            Reset Filters
          </button>
        </div>

        {/* RESULTS */}
        <div className="col-md-9">
          <h5 className="mb-3">Results ({results.length})</h5>

          <div className="row">
            {results.map(p => (
              <div className="col-md-4 mb-3" key={p.id}>
                <div className="card shadow-sm p-2 h-100">
                  <img
                    src={p.imageUrl || "/placeholder.png"}
                    alt={p.name}
                    style={{ height: 160, objectFit: "contain" }}
                  />
                  <h6 className="mt-2">{p.name}</h6>
                  <p className="mb-1 text-secondary">
                    {p.brand} | {p.category}
                  </p>
                  <p className="fw-bold text-success">₹{p.minPrice}</p>
                  <small className="text-muted">{p.attributes}</small>
                </div>
              </div>
            ))}
            {results.length === 0 && (
              <p className="text-center mt-5">No results found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
