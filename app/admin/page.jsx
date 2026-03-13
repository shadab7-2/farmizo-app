"use client";

import { useEffect, useMemo, useState } from "react";
import { Boxes, ShoppingCart, Sprout, Wallet } from "lucide-react";
import { getDashboardStats } from "@/services/admin.service";
import AdminStatCard from "./components/AdminStatCard";
import AdminChart from "./components/AdminChart";
import RecentOrders from "./components/RecentOrders";
import TopSellingProducts from "./components/TopSellingProducts";
import LowStockAlert from "./components/LowStockAlert";
import QuickActions from "./components/QuickActions";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const cards = useMemo(
    () => [
      {
        title: "Total Revenue",
        value: `Rs. ${Number(stats?.totalRevenue || 0).toLocaleString("en-IN")}`,
        trend: stats?.trends?.revenue || 0,
        icon: Wallet,
        iconBgClass: "bg-emerald-100",
        iconClass: "text-emerald-700",
      },
      {
        title: "Total Orders",
        value: Number(stats?.totalOrders || 0).toLocaleString("en-IN"),
        trend: stats?.trends?.orders || 0,
        icon: ShoppingCart,
        iconBgClass: "bg-blue-100",
        iconClass: "text-blue-700",
      },
      {
        title: "Total Customers",
        value: Number(stats?.totalUsers || 0).toLocaleString("en-IN"),
        trend: stats?.trends?.customers || 0,
        icon: Sprout,
        iconBgClass: "bg-amber-100",
        iconClass: "text-amber-700",
      },
      {
        title: "Total Products",
        value: Number(stats?.totalProducts || 0).toLocaleString("en-IN"),
        trend: stats?.trends?.products || 0,
        icon: Boxes,
        iconBgClass: "bg-purple-100",
        iconClass: "text-purple-700",
      },
    ],
    [stats],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-heading">
            Admin Dashboard
          </h1>
          <p className="text-sm text-text-muted">
            Monitor store performance and key operations
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <AdminStatCard
            key={card.title}
            {...card}
            value={loading ? "--" : card.value}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminChart data={stats?.monthlySales || []} />
        </div>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentOrders orders={stats?.recentOrders || []} />
        <TopSellingProducts products={stats?.topProducts || []} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <LowStockAlert products={stats?.lowStockProducts || []} />
      </div>

      {loading && (
        <div className="text-sm text-text-muted">
          Loading dashboard insights...
        </div>
      )}

      {!loading && !error && !stats && (
        <div className="text-sm text-text-muted">
          Dashboard data is unavailable right now.
        </div>
      )}
    </div>
  );
}
