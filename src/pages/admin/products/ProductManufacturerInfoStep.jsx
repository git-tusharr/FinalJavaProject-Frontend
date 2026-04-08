import { toast } from "react-toastify";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useProduct } from "../../../services/ProductContext";

export default function ProductManufacturerInfoStep({ onNext }) {
  const { productState } = useProduct();
  const productId = productState.productId;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Load existing manufacturer info
  useEffect(() => {
    if (!productId) return;

    axios
      .get(`http://localhost:8080/api/products/${productId}/manufacturer`)
      .then(res => {
        if (res.data?.content) {
          setContent(res.data.content);
        }
      })
      .catch(() => {});
  }, [productId]);

  const saveManufacturerInfo = async () => {
    if (!content.trim()) {
      toast.success("Manufacturer description cannot be empty");
      return;
    }

    setLoading(true);

    await axios.post(
      `http://localhost:8080/api/products/${productId}/manufacturer`,
      content,
      {
        headers: { "Content-Type": "text/plain" }
      }
    );

    setLoading(false);
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        From the Manufacturer
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Add brand description, product story, or detailed explanation
        shown on the product page.
      </Typography>

      <TextField
        multiline
        rows={10}
        fullWidth
        placeholder="Example:
Xiaomi brings an immersive viewing experience with a bezel-less design,
powerful speakers, and smart Android TV features for the whole family."
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Button
          variant="contained"
          onClick={saveManufacturerInfo}
          disabled={loading}
        >
          Save & Continue →
        </Button>
      </Box>
    </Box>
  );
}
