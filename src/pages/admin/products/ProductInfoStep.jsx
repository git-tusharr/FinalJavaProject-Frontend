import { toast } from "react-toastify";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography
} from "@mui/material";
import axios from "axios";
import { useProduct } from "../../../services/ProductContext";

export default function ProductInfoStep({ onNext }) {
  const { productState, setProductState } = useProduct();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.description) {
      toast.success("All fields are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/products", {
        name: form.name,
        slug: form.slug,
        description: form.description,
        categoryId: productState.categoryId,
        brandId: productState.brandId
      });

      // store important values for next steps
      setProductState({
        ...productState,
        productId: res.data.id,
        slug: res.data.slug
      });

      onNext(); // move to Attribute step
    } catch (err) {
      toast.success("Product creation failed");
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Product Information
      </Typography>

      <TextField
        label="Product Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 3 }}
      />

      <TextField
        label="Product Slug"
        name="slug"
        value={form.slug}
        onChange={handleChange}
        helperText="URL-friendly name (e.g. xiaomi-f-series-smart-led-tv)"
        fullWidth
        sx={{ mb: 3 }}
      />

      <TextField
        label="Product Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
        sx={{ mb: 4 }}
      />

      <Button variant="contained" onClick={handleSubmit}>
        Save & Continue
      </Button>
    </Box>
  );
}
