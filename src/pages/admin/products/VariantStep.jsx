import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import axios from "axios";
import { useProduct } from "../../../services/ProductContext";

export default function VariantStep({ onNext }) {
  const { productState, setProductState } = useProduct();
  const productId = productState.productId;

  // ✅ ONLY ATTRIBUTES ATTACHED TO PRODUCT
  const [attributes, setAttributes] = useState([]);

  // { attributeId: valueId }
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [variants, setVariants] = useState([]);

  const [form, setForm] = useState({
    sku: "",
    price: "",
    stock: ""
  });

  // 🔥 LOAD PRODUCT-SPECIFIC ATTRIBUTES
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/products/${productId}/attributes`
      )
      .then(res => setAttributes(res.data));
  }, [productId]);

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createVariant = async () => {
    if (
      !form.sku ||
      !form.price ||
      !form.stock ||
      Object.keys(selectedAttributes).length !== attributes.length
    ) {
      alert("Select all attributes and fill all fields");
      return;
    }

    const payload = {
      sku: form.sku,
      price: Number(form.price),
      stock: Number(form.stock),
      attributes: selectedAttributes
    };

    const res = await axios.post(
      `http://localhost:8080/api/products/${productId}/variants`,
      payload
    );

    setVariants(prev => [...prev, res.data]);

    setProductState(prev => ({
      ...prev,
      variants: [...(prev.variants || []), res.data]
    }));

    setForm({ sku: "", price: "", stock: "" });
    setSelectedAttributes({});
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Create Variants
      </Typography>

      {/* ✅ ONLY SELECTED ATTRIBUTES APPEAR */}
      {attributes.map(attr => (
        <TextField
          key={attr.id}
          select
          label={attr.name}
          value={selectedAttributes[attr.id] || ""}
          onChange={e =>
            setSelectedAttributes(prev => ({
              ...prev,
              [attr.id]: Number(e.target.value)
            }))
          }
          fullWidth
          sx={{ mb: 2 }}
        >
          {attr.values.map(val => (
            <MenuItem key={val.id} value={val.id}>
              {val.value}
            </MenuItem>
          ))}
        </TextField>
      ))}

      <TextField
        label="SKU"
        name="sku"
        value={form.sku}
        onChange={handleFormChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Price"
        name="price"
        value={form.price}
        onChange={handleFormChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Stock"
        name="stock"
        value={form.stock}
        onChange={handleFormChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={createVariant}>
        Add Variant
      </Button>

      {variants.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Created Variants</Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                {attributes.map(attr => (
                  <TableCell key={attr.id}>{attr.name}</TableCell>
                ))}
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {variants.map((v, i) => (
                <TableRow key={i}>
                  <TableCell>{v.sku}</TableCell>

                  {attributes.map(attr => {
                    const valId = v.attributes[attr.id];
                    const val = attr.values.find(
                      x => x.id === valId
                    );
                    return (
                      <TableCell key={attr.id}>
                        {val?.value}
                      </TableCell>
                    );
                  })}

                  <TableCell>{v.price}</TableCell>
                  <TableCell>{v.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {variants.length > 0 && (
        <Box sx={{ mt: 4, textAlign: "right" }}>
          <Button variant="contained" onClick={onNext}>
            Continue →
          </Button>
        </Box>
      )}
    </Box>
  );
}
