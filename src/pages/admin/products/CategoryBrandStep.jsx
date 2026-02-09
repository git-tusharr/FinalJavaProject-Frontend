import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Chip } from "@mui/material";
import axios from "axios";
import { useProduct } from "../../../services/ProductContext";
export default function CategoryBrandStep({ onNext }) {


  const { productState, setProductState } = useProduct();

  const [categoryId, setCategoryId] = useState("");
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBreadcrumb = async () => {
    if (!categoryId) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/api/categories/breadcrumb/${categoryId}`
      );
      setBreadcrumb(res.data);
    } catch (err) {
      alert("Invalid category ID");
      setBreadcrumb([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setProductState({
      ...productState,
      categoryId: Number(categoryId)
    });
      onNext();
    alert("Category selected successfully");
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Select Category
      </Typography>

      <TextField
        label="Final Category ID"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button variant="outlined" onClick={fetchBreadcrumb}>
        Preview Breadcrumb
      </Button>

      {loading && (
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      )}

      {breadcrumb.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Breadcrumb Preview
          </Typography>

          {breadcrumb.map((cat, index) => (
            <Chip
              key={cat.id}
              label={cat.name}
              sx={{ mr: 1 }}
              color={index === breadcrumb.length - 1 ? "primary" : "default"}
            />
          ))}
        </Box>
      )}

      {breadcrumb.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleConfirm}
          >
            Confirm Category
          </Button>
        </Box>
      )}
    </Box>
  );
}
