"use client";

import Image from "@/components/common/SafeImage";
import { AlertTriangle } from "lucide-react";

export default function LowStockAlert({ products = [] }) {
  return (
    <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-text-heading">Low Stock Alert</h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
          <AlertTriangle size={14} />
          {products.length} items
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {products.length === 0 ? (
          <p className="text-sm text-text-muted">No low stock products right now.</p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border-default p-3"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={product.image || "/placeholder.jpg"}
                  alt={product.name}
                  width={44}
                  height={44}
                  className="rounded-md object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-text-heading">{product.name}</p>
                  <p className="text-xs text-text-muted">Rs. {Number(product.price || 0).toLocaleString("en-IN")}</p>
                </div>
              </div>
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                {product.stock} left
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
