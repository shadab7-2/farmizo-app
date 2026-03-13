"use client";

import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  LayoutDashboard,
  MessageSquareWarning,
  Package,
  ReceiptText,
  TicketPercent,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ReceiptText },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareWarning },
];

export default function AdminLayout({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin");
    } else if (user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="w-full bg-surface-sidebar p-6 text-text-inverse lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:overflow-y-auto">
        <h2 className="text-lg font-semibold">Farmizo Admin</h2>
        <p className="text-xs text-green-200">Seller control panel</p>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 ${
                  isActive
                    ? "bg-white/20"
                    : "hover:bg-white/10 transition"
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="p-4 sm:p-6 lg:ml-64 lg:p-10">
        {children}
      </main>
    </div>
  );
}
