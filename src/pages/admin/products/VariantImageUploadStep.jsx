import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Paper,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useProduct } from "../../../services/ProductContext";
import axios from "axios";

/* ---------- Sortable Image Card ---------- */
function SortableImage({ image, onDelete, onSetPrimary }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        p: 1,
        display: "flex",
        alignItems: "center",
        mb: 2
      }}
      {...attributes}
      {...listeners}
    >
      <img
        src={image.preview}
        alt=""
        style={{ width: 80, height: 80, objectFit: "cover", marginRight: 16 }}
      />

      <Box sx={{ flex: 1 }}>
        {image.isPrimary && (
          <Typography color="primary" fontSize={12}>
            PRIMARY IMAGE
          </Typography>
        )}
      </Box>

      <IconButton onClick={() => onSetPrimary(image.id)}>
        <StarIcon color={image.isPrimary ? "warning" : "disabled"} />
      </IconButton>

      <IconButton onClick={() => onDelete(image.id)}>
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
}

/* ---------- Main Component ---------- */
export default function VariantImageUploadStep({ onNext }) {
  const { productState } = useProduct();

  const [variants, setVariants] = useState([]);
  const [variantId, setVariantId] = useState("");
  const [images, setImages] = useState([]);

  /* Fetch variants */
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${productState.productId}/variants`)
      .then(res => setVariants(res.data));
  }, []);

  /* Handle file selection */
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);

    const mapped = files.map((file, index) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      isPrimary: images.length === 0 && index === 0
    }));

    setImages(prev => [...prev, ...mapped]);
  };

  /* Drag reorder */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  /* Set primary */
  const setPrimary = (id) => {
    setImages(images.map(img => ({
      ...img,
      isPrimary: img.id === id
    })));
  };

  /* Delete image */
  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  /* Upload to backend */
  const uploadImages = async () => {
    if (!variantId || images.length === 0) {
      toast.success("Select variant and images");
      return;
    }

    const formData = new FormData();
    images.forEach(img => formData.append("files", img.file));

    await fetch(
      `http://localhost:8080/api/products/${productState.productId}/images?variantId=${variantId}`,
      {
        method: "POST",
        body: formData
      }
    );

    toast.success("Images uploaded successfully");
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Variant Image Upload
      </Typography>

      {/* Variant Select */}
      <Select
        fullWidth
        value={variantId}
        onChange={(e) => setVariantId(e.target.value)}
        displayEmpty
        sx={{ mb: 3 }}
      >
        <MenuItem value="" disabled>
          Select Variant
        </MenuItem>
        {variants.map(v => (
          <MenuItem key={v.id} value={v.id}>
            {v.sku}
          </MenuItem>
        ))}
      </Select>

      {/* File Input */}
      <Button variant="outlined" component="label">
        Select Images
        <input hidden type="file" multiple onChange={handleFiles} />
      </Button>

      {/* Drag & Drop Area */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={images.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <Box sx={{ mt: 3 }}>
            {images.map(img => (
              <SortableImage
                key={img.id}
                image={img}
                onDelete={removeImage}
                onSetPrimary={setPrimary}
              />
            ))}
          </Box>
        </SortableContext>
      </DndContext>

      <Button
        variant="contained"
        sx={{ mt: 4 }}
        onClick={uploadImages}
      >
        Save & Continue
      </Button>
    </Box>
  );
}
