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

export default function ProductAdditionalInfoStep({ onNext }) {
  const { productState } = useProduct();
  const productId = productState.productId;

  const [info, setInfo] = useState([]);
  const [row, setRow] = useState({ infoKey: "", infoValue: "" });

  // LOAD existing data
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${productId}/additional-info`)
      .then(res => {
        const list = res.data.map(i => ({
          infoKey: i.infoKey,
          infoValue: i.infoValue
        }));
        setInfo(list);
      });
  }, [productId]);

  // ADD NEW ROW
  const addRow = () => {
    if (!row.infoKey.trim() || !row.infoValue.trim()) return;
    setInfo(prev => [...prev, row]);
    setRow({ infoKey: "", infoValue: "" });
  };

  // DELETE ROW
  const removeRow = index => {
    setInfo(prev => prev.filter((_, i) => i !== index));
  };

  // SAVE BULK TO BACKEND
  const saveInfo = async () => {
    if (info.length === 0) {
      toast.success("Add at least one entry");
      return;
    }

    await axios.post(
      `http://localhost:8080/api/products/${productId}/additional-info`,
      info // already correct shape!
    );

    toast.success("Additional Information saved");
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Additional Information
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Key"
          value={row.infoKey}
          onChange={e => setRow({ ...row, infoKey: e.target.value })}
        />
        <TextField
          label="Value"
          value={row.infoValue}
          onChange={e => setRow({ ...row, infoValue: e.target.value })}
        />
        <Button variant="contained" onClick={addRow}>
          Add
        </Button>
      </Box>

      <List>
        {info.map((i, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <IconButton onClick={() => removeRow(idx)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            • <b>{i.infoKey}</b>: {i.infoValue}
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 4, textAlign: "right" }}>
        <Button variant="contained" onClick={saveInfo}>
          Save & Continue →
        </Button>
      </Box>
    </Box>
  );
}
