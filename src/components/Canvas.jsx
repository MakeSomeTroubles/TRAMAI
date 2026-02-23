import { useCallback } from 'react';

export default function Canvas({ image, onImageLoad }) {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onImageLoad(file);
      }
    },
    [onImageLoad]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        onImageLoad(file);
      }
    },
    [onImageLoad]
  );

  return (
    <main
      className="flex-1 bg-canvas flex items-center justify-center relative overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {image ? (
        <img
          src={image}
          alt="Editing canvas"
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      ) : (
        <div className="flex flex-col items-center gap-4 text-text-secondary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="w-20 h-20 text-text-muted"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <p className="text-sm">Drop an image here or click to upload</p>
          <label className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-lg cursor-pointer transition-colors">
            Open Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          <p className="text-xs text-text-muted">Supports JPG, PNG, WebP, TIFF</p>
        </div>
      )}
    </main>
  );
}
