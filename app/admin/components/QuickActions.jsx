"use client";

import Link from "next/link";
import { Boxes, PackagePlus, Percent, ShoppingBag } from "lucide-react";

const actions = [
  {
    href: "/admin/products",
    label: "Add Product",
    icon: PackagePlus,
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
  {
    href: "/admin/coupons",
    label: "Create Coupon",
    icon: Percent,
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  {
    href: "/admin/orders",
    label: "View Orders",
    icon: ShoppingBag,
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  {
    href: "/admin/products",
    label: "Manage Inventory",
    icon: Boxes,
    bg: "bg-purple-100",
    text: "text-purple-700",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-heading">Quick Actions</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 rounded-xl border border-border-default p-3 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            <span className={`rounded-lg p-2 ${action.bg}`}>
              <action.icon size={16} className={action.text} />
            </span>
            <span className="text-sm font-medium text-text-heading">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
