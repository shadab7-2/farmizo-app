"use client";

import Link from "next/link";
import Image from "@/components/common/SafeImage";
import { Leaf, Sprout, Wrench, Flower } from "lucide-react";

const iconMap = {
  plants: Leaf,
  plant: Leaf,
  seeds: Sprout,
  seed: Sprout,
  tools: Wrench,
  tool: Wrench,
  pots: Flower,
  pot: Flower,
};

const getIcon = (category) => {
  const key =
    String(category?.slug || category?.name || "")
      .toLowerCase()
      .replace(/\s+/g, "") || "default";
  return iconMap[key] || Leaf;
};

const getCountLabel = (category) => {
  const count =
    category?.productCount ??
    category?.product_count ??
    category?.count ??
    (Array.isArray(category?.products) ? category.products.length : null);

  if (Number.isFinite(count)) {
    return `${count} product${count === 1 ? "" : "s"}`;
  }
  return "Explore products";
};

export default function CategoryCard({ category }) {
  const Icon = getIcon(category);
  const countLabel = getCountLabel(category);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
      aria-label={`View ${category.name}`}
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={category.image || "/placeholder.jpg"}
          alt={category.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-text-heading/30 via-text-heading/15 to-text-heading/60" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-surface-card/90 px-3 py-1 text-xs font-semibold text-action-primary shadow">
          <Icon size={14} />
          Category
        </div>
      </div>

      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-bg-section-soft text-action-primary">
            <Icon size={18} />
          </span>
          <h3 className="text-lg font-semibold text-text-heading line-clamp-1">
            {category.name}
          </h3>
        </div>
        <p className="text-sm text-text-muted">{countLabel}</p>
      </div>
    </Link>
  );
}
