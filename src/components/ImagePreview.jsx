export default function ImagePreview({ src, alt = 'Preview' }) {
  if (!src) return null;

  return (
    <div className="mt-2 rounded-md overflow-hidden bg-input-bg border border-node-border">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto block"
        style={{ maxHeight: 260 }}
      />
    </div>
  );
}
