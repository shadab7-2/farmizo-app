"use client";

import Image from "@/components/common/SafeImage";

const formatMoney = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

export default function TopSellingProducts({ products = [] }) {
  return (
    <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-heading">Top Selling Products</h3>

      <div className="mt-4 space-y-3">
        {products.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-6">No sales data available</p>
        ) : (
          products.map((product) => (
            <div
              key={product.productId || product.name}
              className="flex items-center justify-between gap-3 rounded-xl border border-border-default bg-surface-card p-3 transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-text-heading">{product.name}</p>
                  <p className="text-xs text-text-muted">
                    {product.salesCount} sales • {formatMoney(product.revenue)}
                  </p>
                </div>
              </div>
              <a
                href="/admin/products"
                className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-semibold text-action-primary hover:bg-surface-hover"
              >
                View / Edit
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
