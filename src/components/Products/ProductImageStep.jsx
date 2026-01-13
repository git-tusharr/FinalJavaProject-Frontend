import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { uploadImages } from "../../api/productImageApi";

export default function ProductImageStep({ productData, onConfirm }) {
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
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

  // Drag-and-drop reorder
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setImages(reordered);

    const reorderedFiles = reordered.map((img) => img.file);
    setSelectedFiles(reorderedFiles);
  };

  // Upload images
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
        files: selectedFiles, // no variantId
      });

      alert("Product images uploaded successfully!");
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
      <h3 className="text-yellow-400 text-2xl font-bold">Upload Product Images</h3>

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
          <Droppable droppableId="product-images" direction="horizontal">
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
