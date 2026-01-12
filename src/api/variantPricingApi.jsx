import axios from "axios";

const API_BASE = "http://localhost:8080/api/variants";

// Set base price (MRP + Selling Price)
export const setVariantPrice = async (variantId, data) => {
  const res = await axios.post(
    `${API_BASE}/${variantId}/pricing/price`,
    data
  );
  return res.data;
};

// Set discount
export const setVariantDiscount = async (variantId, data) => {
  const res = await axios.post(
    `${API_BASE}/${variantId}/pricing/discount`,
    data
  );
  return res.data;
};

// Get final pricing
export const getVariantPricing = async (variantId) => {
  const res = await axios.get(
    `${API_BASE}/${variantId}/pricing`
  );
  return res.data;
};
