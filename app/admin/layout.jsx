"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

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
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <nav className="space-y-4">
          <a href="/admin" className="block">Dashboard</a>
          <a href="/admin/orders" className="block">Orders</a>
          <Link href = "/admin/products" className = "block"></Link>
          {/* <a href="/admin/products" className="block">Products</a> */}
          <a href="/admin/users" className="block">Users</a>
        </nav>
      </aside>

      <main className="flex-1 p-10 bg-gray-50">
        {children}
      </main>
    </div>
  );
}