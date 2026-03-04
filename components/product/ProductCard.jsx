import Image from "@/components/common/SafeImage";
import Link from "next/link";

export default function ProductCard({ product }) {
  const productHref = product?.slug
    ? `/products/${encodeURIComponent(product.slug)}`
    : "/products";

  // const imageSrc = product.image || product.image?.[0] || "/placeholder-product.jpg"
  return (
    <div className="group bg-bg-page rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition border border-border-default">

      {/* IMAGE */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={product.images[0] || "/public/hero-plants.jpg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* CONTENT */}
      <div className="p-5">

        <p className="text-xs uppercase tracking-wide text-text-muted">
          {product.category}
        </p>

        <h3 className="mt-1 text-lg font-semibold text-text-heading">
          {product.name}
        </h3>

        <p className="mt-2 text-sm text-text-muted line-clamp-2">
          {product.description}
        </p>

        {/* PRICE + CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-action-primary">
            ₹{product.price}
          </span>

          <Link
            href={productHref}
            className="text-sm font-semibold text-action-primary hover:text-action-primary-hover transition"
          >
            View →
          </Link>
        </div>

      </div>
    </div>
  );
}
