import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { uploadImages } from "../../api/productImageApi";
import { X } from "lucide-react";

export default function VariantImageStep({ productData, variants, onConfirm }) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || null);

  // 🔑 images stored per variant
  const [variantImages, setVariantImages] = useState({});
  const [uploading, setUploading] = useState(false);

  /* ===========================
     Helpers
  ============================ */
  const images = variantImages[selectedVariant?.id] || [];

  /* ===========================
     File selection
  ============================ */
  const handleFilesChange = (e) => {
    if (!selectedVariant) return;

    const files = Array.from(e.target.files);
    const mapped = files.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setVariantImages((prev) => ({
      ...prev,
      [selectedVariant.id]: [
        ...(prev[selectedVariant.id] || []),
        ...mapped,
      ],
    }));
  };

  /* ===========================
     Remove image
  ============================ */
  const handleRemove = (id) => {
    setVariantImages((prev) => ({
      ...prev,
      [selectedVariant.id]: prev[selectedVariant.id].filter(
        (img) => img.id !== id
      ),
    }));
  };

  /* ===========================
     Drag reorder
  ============================ */
  const handleDragEnd = (result) => {
    if (!result.destination || !selectedVariant) return;

    const reordered = Array.from(variantImages[selectedVariant.id] || []);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    setVariantImages((prev) => ({
      ...prev,
      [selectedVariant.id]: reordered,
    }));
  };

  /* ===========================
     Upload
  ============================ */
  const handleUpload = async () => {
    if (!selectedVariant) return;
    if (!images.length) return alert("Please select images");

    try {
      setUploading(true);

      const res = await uploadImages({
        productId: productData.id,
        variantId: selectedVariant.id,
        files: images.map((i) => i.file),
      });

      onConfirm({
        variantId: selectedVariant.id,
        images: res,
      });
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ===========================
     UI
  ============================ */
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-2xl font-bold text-yellow-400">
          Variant Image Upload
        </h3>
        <p className="text-gray-400 mt-1">
          Each variant has its own images
        </p>
      </div>

      {/* Variant Selector */}
      {variants.length > 1 && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <label className="block text-sm text-gray-400 mb-2">
            Select Variant
          </label>
          <select
            value={selectedVariant?.id}
            onChange={(e) =>
              setSelectedVariant(
                variants.find((v) => v.id === Number(e.target.value))
              )
            }
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-yellow-400"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.sku}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Upload Area */}
      <label className="block bg-gray-900 border border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-yellow-400 transition">
        <input
          type="file"
          multiple
          onChange={handleFilesChange}
          className="hidden"
        />
        <p className="text-gray-300 font-medium">
          Upload images for{" "}
          <span className="text-yellow-400 font-semibold">
            {selectedVariant?.sku}
          </span>
        </p>
      </label>

      {/* Preview */}
      {images.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-4 overflow-x-auto pb-2"
              >
                {images.map((img, index) => (
                  <Draggable
                    key={img.id}
                    draggableId={img.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative group w-36 h-36 rounded-xl overflow-hidden border border-gray-700"
                      >
                        <img
                          src={img.preview}
                          alt=""
                          className="w-full h-full object-cover"
                        />

                        <button
                          onClick={() => handleRemove(img.id)}
                          className="absolute top-2 right-2 bg-black/70 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={16} className="text-white" />
                        </button>
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

      {/* Action */}
      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 px-8 py-3 rounded-xl font-bold text-black transition"
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      </div>
    </div>
  );
}
