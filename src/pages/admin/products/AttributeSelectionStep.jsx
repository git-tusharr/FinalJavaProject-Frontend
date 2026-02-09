import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button
} from "@mui/material";
import axios from "axios";
import { useProduct } from "../../../services/ProductContext";

export default function AttributeSelectionStep({ onNext }) {
  const { productState } = useProduct();
  const [attributes, setAttributes] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    const res = await axios.get("http://localhost:8080/api/attributes");
    setAttributes(res.data);
  };

  const toggleAttribute = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (selected.length === 0) {
      alert("Select at least one attribute");
      return;
    }

    await axios.post(
      `http://localhost:8080/api/products/${productState.productId}/attributes`,
      {
        attributeIds: selected
      }
    );

    onNext(); // move to Variant step
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Select Attributes
      </Typography>

      <FormGroup>
        {attributes.map((attr) => (
          <FormControlLabel
            key={attr.id}
            control={
              <Checkbox
                checked={selected.includes(attr.id)}
                onChange={() => toggleAttribute(attr.id)}
              />
            }
            label={attr.name}
          />
        ))}
      </FormGroup>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={handleSave}>
          Save & Continue
        </Button>
      </Box>
    </Box>
  );
}
