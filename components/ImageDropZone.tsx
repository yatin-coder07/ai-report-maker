"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";

type ImageDropzoneProps = {
  // Optional: parent can receive selected images
  onImagesChange?: (files: File[]) => void;
};

export default function ImageDropzone({ onImagesChange }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle click -> open system file picker
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection from system
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const newImages = [...images, ...fileArray];
    setImages(newImages);
    onImagesChange?.(newImages);

    // Reset input so selecting the same file again will still trigger change
    e.target.value = "";
  };

  // Prevent default so drop works
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Handle files dropped into the area
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const newImages = [...images, ...fileArray];
    setImages(newImages);
    onImagesChange?.(newImages);
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange?.(updated);
  };

  return (
    <div className="space-y-4">
      {/* Drop area */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-zinc-700 bg-zinc-900/40"}
        `}
        onClick={handleBrowseClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <p className="text-sm text-zinc-300">
          <span className="font-semibold">Drag & drop</span> images here, or{" "}
          <button
            type="button"
            onClick={handleBrowseClick}
            className="underline underline-offset-4"
          >
            browse files
          </button>
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          Supported: JPG, PNG, GIF, etc.
        </p>
      </div>

      {/* Preview selected images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((file, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-xl border border-zinc-800"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 text-xs bg-black/70 px-2 py-1 rounded-full"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
