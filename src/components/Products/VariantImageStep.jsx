import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { uploadImages } from "../../api/productImageApi";

export default function VariantImageStep({ productData, variants, onConfirm }) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFilesChange = (e) => {
    const filesArray = Array.from(e.target.files);
    const newImages = filesArray.map((file, idx) => ({
      id: Date.now() + idx,
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    setSelectedFiles((prev) => [...prev, ...filesArray]);
  };

  // Handle drag-and-drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setImages(reordered);

    // Reorder files array too
    const reorderedFiles = reordered.map((img) => img.file);
    setSelectedFiles(reorderedFiles);
  };

  // Upload images to backend
  const handleUpload = async () => {
    if (!selectedFiles.length) {
      alert("Please select images first!");
      return;
    }

    if (!productData?.id) {
      alert("Product ID not available!");
      return;
    }

    try {
      setUploading(true);
      const result = await uploadImages({
        productId: productData.id,
        variantId: selectedVariant?.id,
        files: selectedFiles,
      });

      alert("Images uploaded successfully!");
      onConfirm(result); // send uploaded images back to parent
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h3 className="text-yellow-400 text-2xl font-bold">Upload Variant Images</h3>

      {/* Variant Selector */}
      {variants.length > 1 && (
        <div>
          <label className="text-white mr-2">Select Variant:</label>
          <select
            value={selectedVariant?.id || ""}
            onChange={(e) =>
              setSelectedVariant(
                variants.find((v) => v.id === Number(e.target.value))
              )
            }
            className="px-3 py-2 rounded bg-gray-800 text-white"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.sku}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* File Input */}
      <div>
        <input
          type="file"
          multiple
          onChange={handleFilesChange}
          className="text-white"
        />
      </div>

      {/* Drag-and-drop image previews */}
      {images.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-4 overflow-x-auto py-4"
              >
                {images.map((img, idx) => (
                  <Draggable key={img.id} draggableId={img.id.toString()} index={idx}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative w-32 h-32 border border-gray-700 rounded overflow-hidden"
                      >
                        <img
                          src={img.preview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded font-bold text-black"
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </button>
    </div>
  );
}
