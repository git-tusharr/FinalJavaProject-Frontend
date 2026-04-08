import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useProduct } from "../../../services/ProductContext";

export default function ProductFeatureStep({ onNext }) {
  const { productState } = useProduct();
  const productId = productState.productId;

  const [features, setFeatures] = useState([]);
  const [input, setInput] = useState("");

  // 🔹 Load existing features (edit mode)
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${productId}/features`)
      .then(res => {
        const list = res.data.map(f => f.feature);
        setFeatures(list);
      });
  }, [productId]);

  // ➕ Add feature
  const addFeature = () => {
    if (!input.trim()) return;
    setFeatures(prev => [...prev, input.trim()]);
    setInput("");
  };

  // ❌ Remove feature
  const removeFeature = index => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  // 💾 Save all
  const saveFeatures = async () => {
    if (features.length === 0) {
      toast.success("Add at least one feature");
      return;
    }

    await axios.post(
      `http://localhost:8080/api/products/${productId}/features/bulk`,
      features
    );

    toast.success("Features saved");
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Product Highlights / Features
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Add short bullet points shown on product page
      </Typography>

      {/* INPUT */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Enter feature"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addFeature()}
        />
        <Button variant="contained" onClick={addFeature}>
          Add
        </Button>
      </Box>

      {/* FEATURE LIST */}
      <List>
        {features.map((f, i) => (
          <ListItem
            key={i}
            secondaryAction={
              <IconButton onClick={() => removeFeature(i)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            • {f}
          </ListItem>
        ))}
      </List>

      {/* SAVE */}
      <Box sx={{ mt: 4, textAlign: "right" }}>
        <Button variant="contained" onClick={saveFeatures}>
          Save & Continue →
        </Button>
      </Box>
    </Box>
  );
}
