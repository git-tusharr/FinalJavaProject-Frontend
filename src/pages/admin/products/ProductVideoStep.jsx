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

export default function ProductVideoStep({ onNext }) {
  const { productState } = useProduct();
  const productId = productState.productId;

  const [videos, setVideos] = useState([]);
  const [row, setRow] = useState({ title: "", videoUrl: "" });

  // LOAD existing
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${productId}/videos`)
      .then(res => {
        const list = res.data.map(v => ({
          title: v.title,
          videoUrl: v.videoUrl
        }));
        setVideos(list);
      });
  }, [productId]);

  // ADD
  const addRow = () => {
    if (!row.videoUrl.trim()) return;
    setVideos(prev => [...prev, row]);
    setRow({ title: "", videoUrl: "" });
  };

  // REMOVE
  const removeRow = index => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  // SAVE BULK
  const saveVideos = async () => {
    if (videos.length === 0) {
      alert("Add at least one video");
      return;
    }

    await axios.post(
      `http://localhost:8080/api/products/${productId}/videos`,
      videos // ARRAY BULK
    );

    alert("Videos saved successfully");
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Product Videos
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Title (optional)"
          value={row.title}
          onChange={e => setRow({ ...row, title: e.target.value })}
        />
        <TextField
          label="Video URL"
          value={row.videoUrl}
          onChange={e => setRow({ ...row, videoUrl: e.target.value })}
        />
        <Button variant="contained" onClick={addRow}>
          Add
        </Button>
      </Box>

      <List>
        {videos.map((v, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <IconButton onClick={() => removeRow(idx)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            • {v.title ? `${v.title} - ` : ""}{v.videoUrl}
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 4, textAlign: "right" }}>
        <Button variant="contained" onClick={saveVideos}>
          Save & Continue →
        </Button>
      </Box>
    </Box>
  );
}
