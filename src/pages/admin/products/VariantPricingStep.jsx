import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider
} from "@mui/material";
import axios from "axios";
import { useProduct } from "../../../services/ProductContext";

export default function VariantPricingStep({ onNext }) {
  const { productState } = useProduct();

  // 🔥 REMOVE BROKEN VARIANTS
  const safeVariants = (productState.variants || []).filter(
    v => typeof v.id === "number"
  );

  const [variantId, setVariantId] = useState("");

  // numeric id ONLY when valid
  const id =
    variantId !== "" && !isNaN(Number(variantId))
      ? Number(variantId)
      : null;

  const [priceForm, setPriceForm] = useState({
    mrp: "",
    sellingPrice: ""
  });

  const [discountForm, setDiscountForm] = useState({
    discountType: "PERCENT",
    discountValue: ""
  });

  const [pricingPreview, setPricingPreview] = useState(null);

  useEffect(() => {
    console.log("Pricing variants:", productState.variants);

    if (!id) {
      setPriceForm({ mrp: "", sellingPrice: "" });
      setDiscountForm({ discountType: "PERCENT", discountValue: "" });
      setPricingPreview(null);
      return;
    }

    loadPricing();
  }, [id]);

  const loadPricing = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/auth/variants/${id}/pricing`
      );
      setPricingPreview(res.data);
    } catch {
      setPricingPreview(null);
    }
  };

  const savePrice = async () => {
    if (!id) return;

    await axios.post(
      `http://localhost:8080/auth/variants/${id}/pricing/price`,
      {
        mrp: Number(priceForm.mrp),
        sellingPrice: Number(priceForm.sellingPrice)
      }
    );

    loadPricing();
  };

  const saveDiscount = async () => {
    if (!id) return;

    await axios.post(
      `http://localhost:8080/auth/variants/${id}/pricing/discount`,
      {
        discountType: discountForm.discountType,
        discountValue: Number(discountForm.discountValue)
      }
    );

    loadPricing();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Variant Pricing & Discount
      </Typography>

      {/* ✅ SAFE SELECT */}
      <TextField
        select
        label="Select Variant"
        value={variantId}
        onChange={e => {
          const value = e.target.value;
          if (!isNaN(Number(value))) {
            setVariantId(value);
          }
        }}
        fullWidth
        sx={{ mb: 3 }}
      >
        {safeVariants.map(v => (
          <MenuItem key={v.id} value={String(v.id)}>
            {v.sku}
          </MenuItem>
        ))}
      </TextField>

      {!id && (
        <Typography color="text.secondary">
          Please select a variant to set pricing
        </Typography>
      )}

      {id && (
        <>
          <Typography fontWeight="bold">Base Pricing</Typography>

          <TextField
            label="MRP"
            value={priceForm.mrp}
            onChange={e =>
              setPriceForm({ ...priceForm, mrp: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Selling Price"
            value={priceForm.sellingPrice}
            onChange={e =>
              setPriceForm({
                ...priceForm,
                sellingPrice: e.target.value
              })
            }
            fullWidth
            sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={savePrice}>
            Save Price
          </Button>

          <Divider sx={{ my: 4 }} />

          <Typography fontWeight="bold">Discount</Typography>

          <TextField
            select
            label="Discount Type"
            value={discountForm.discountType}
            onChange={e =>
              setDiscountForm({
                ...discountForm,
                discountType: e.target.value
              })
            }
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="PERCENT">Percentage (%)</MenuItem>
            <MenuItem value="FLAT">Flat (₹)</MenuItem>
          </TextField>

          <TextField
            label="Discount Value"
            value={discountForm.discountValue}
            onChange={e =>
              setDiscountForm({
                ...discountForm,
                discountValue: e.target.value
              })
            }
            fullWidth
            sx={{ mb: 2 }}
          />

          <Button variant="contained" onClick={saveDiscount}>
            Apply Discount
          </Button>

          {pricingPreview && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Pricing Preview</Typography>
              <Typography>MRP: ₹{pricingPreview.mrp}</Typography>
              <Typography>Selling: ₹{pricingPreview.sellingPrice}</Typography>
              <Typography>Discount: ₹{pricingPreview.discount}</Typography>
              <Typography fontWeight="bold">
                Final Price: ₹{pricingPreview.finalPrice}
              </Typography>
            </Box>
          )}
        </>
      )}

      <Box sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={onNext}>
          Continue →
        </Button>
      </Box>
    </Box>
  );
}
