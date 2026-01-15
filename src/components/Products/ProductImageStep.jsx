import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { uploadImages } from "../../api/productImageApi";
import { X } from "lucide-react";

export default function ProductImageStep({ productData, onConfirm }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  /* ===========================
     Cleanup object URLs
  ============================ */
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  /* ===========================
     File selection
  ============================ */
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);

    const mapped = files.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...mapped]);
  };

  /* ===========================
     Remove image
  ============================ */
  const handleRemove = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  /* ===========================
     Drag reorder
  ============================ */
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(images);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    setImages(reordered);
  };

  /* ===========================
     Upload
  ============================ */
  const handleUpload = async () => {
    if (!images.length) {
      alert("Please select at least one image");
      return;
    }

    if (!productData?.id) {
      alert("Product ID not found");
      return;
    }

    try {
      setUploading(true);

      const res = await uploadImages({
        productId: productData.id,
        files: images.map((i) => i.file), // no variantId
      });

      onConfirm(res);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
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
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-yellow-400">
          Product Images
        </h3>
        <p className="text-gray-400 mt-1">
          These images represent the product as a whole
        </p>
      </div>

      {/* Upload area */}
      <label className="block bg-gray-900 border border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-yellow-400 transition">
        <input
          type="file"
          multiple
          onChange={handleFilesChange}
          className="hidden"
        />
        <p className="text-gray-300 font-medium">
          Click to upload product images
        </p>
        <p className="text-gray-500 text-sm mt-1">
          JPG, PNG, WEBP supported
        </p>
      </label>

      {/* Preview */}
      {images.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="product-images" direction="horizontal">
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

                        {/* Primary badge */}
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">
                            Primary
                          </span>
                        )}

                        {/* Remove */}
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
