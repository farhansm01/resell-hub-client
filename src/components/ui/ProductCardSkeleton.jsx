// components/ui/ProductCardSkeleton.jsx

export default function ProductCardSkeleton() {
  return (
    <div
      className="rounded-xl border overflow-hidden animate-pulse"
      style={{ borderColor: "rgba(122, 108, 93, 0.25)", backgroundColor: "#ffffff" }}
    >
      {/* Image */}
      <div className="w-full h-48" style={{ backgroundColor: "rgba(122, 108, 93, 0.15)" }} />

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 w-3/4 rounded" style={{ backgroundColor: "rgba(122, 108, 93, 0.15)" }} />

        {/* Badges: category + condition */}
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full" style={{ backgroundColor: "rgba(122, 108, 93, 0.15)" }} />
          <div className="h-5 w-16 rounded-full" style={{ backgroundColor: "rgba(122, 108, 93, 0.15)" }} />
        </div>

        {/* Price */}
        <div className="h-5 w-1/3 rounded" style={{ backgroundColor: "rgba(122, 108, 93, 0.15)" }} />

        {/* Button */}
        <div className="h-9 w-full rounded-xl" style={{ backgroundColor: "rgba(122, 108, 93, 0.15)" }} />
      </div>
    </div>
  );
}