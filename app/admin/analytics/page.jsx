"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Boxes,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";
import { getAdminAnalyticsBundle } from "@/services/admin.service";

const PIE_COLORS = ["#16a34a", "#2563eb", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

const currency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const number = (value) => Number(value || 0).toLocaleString("en-IN");

const getStatusLabel = (value) =>
  String(value || "unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

function SkeletonCard() {
  return <div className="h-28 animate-pulse rounded-xl border border-gray-200 bg-gray-100" />;
}

function SectionSkeleton() {
  return <div className="h-[360px] animate-pulse rounded-xl border border-gray-200 bg-gray-100" />;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError("");
      try {
        const analytics = await getAdminAnalyticsBundle();
        setData(analytics);
      } catch (err) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const overview = data?.overview || {};
  const sales = data?.sales || {};
  const products = data?.products || {};
  const customers = data?.customers || {};
  const payments = data?.payments || {};
  const methodSplit = payments.paymentMethodSplit || [];

  const metricCards = [
    {
      label: "Total Sales",
      value: currency(overview.totalRevenue),
      icon: Wallet,
      iconClass: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Total Orders",
      value: number(overview.totalOrders),
      icon: ShoppingCart,
      iconClass: "bg-blue-100 text-blue-700",
    },
    {
      label: "Customers",
      value: number(overview.totalCustomers),
      icon: Users,
      iconClass: "bg-amber-100 text-amber-700",
    },
    {
      label: "Products",
      value: number(overview.totalProducts),
      icon: Boxes,
      iconClass: "bg-purple-100 text-purple-700",
    },
    {
      label: "Payment Success",
      value: `${number(payments.successRate || 0)}%`,
      icon: Wallet,
      iconClass: "bg-emerald-100 text-emerald-700",
    },
  ];

  const hasContent =
    (sales.revenueByDay?.length || 0) > 0 ||
    (products.topSellingProducts?.length || 0) > 0 ||
    (customers.topCustomersBySpending?.length || 0) > 0 ||
    (methodSplit.length || 0) > 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-72 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-96 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
        <SectionSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <h2 className="text-lg font-semibold text-red-700">Analytics unavailable</h2>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!hasContent) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-gray-800">No analytics data yet</h2>
        <p className="mt-2 text-sm text-gray-500">
          Place orders and onboard customers to unlock insights here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-heading">Analytics Dashboard</h1>
        <p className="text-sm text-text-muted">
          Sales, orders, product performance, and customer insights.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((item) => (
          <div key={item.label} className="rounded-xl border border-border-default bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-text-heading">{item.value}</p>
              </div>
              <div className={`rounded-lg p-2 ${item.iconClass}`}>
                <item.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm">
          <p className="text-sm text-text-muted">Average Order Value (AOV)</p>
          <p className="mt-1 text-xl font-semibold text-text-heading">{currency(overview.averageOrderValue)}</p>
        </div>
        <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm">
          <p className="text-sm text-text-muted">Revenue Growth (30d)</p>
          <p className="mt-1 text-xl font-semibold text-text-heading">{number(overview.revenueGrowthPercent)}%</p>
        </div>
        <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm">
          <p className="text-sm text-text-muted">Current 30d Revenue</p>
          <p className="mt-1 text-xl font-semibold text-text-heading">{currency(overview.currentPeriodRevenue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading">Revenue by Day (30 days)</h3>
          <p className="mb-4 text-sm text-text-muted">Track daily revenue trend.</p>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sales.revenueByDay || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `Rs ${number(v)}`} width={80} />
                <Tooltip formatter={(value) => [currency(value), "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading">Orders per Day (30 days)</h3>
          <p className="mb-4 text-sm text-text-muted">Order count movement over the month.</p>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sales.ordersByDay || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip formatter={(value) => [number(value), "Orders"]} />
                <Bar dataKey="orders" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading">Payment Mix</h3>
          <p className="mb-4 text-sm text-text-muted">COD vs Online and success rate.</p>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={methodSplit}
                  dataKey="orders"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ name, percent }) => `${getStatusLabel(name)} ${(percent * 100).toFixed(1)}%`}
                >
                  {methodSplit.map((entry, index) => (
                    <Cell key={entry.method} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${number(value)} orders`,
                    `${getStatusLabel(props.payload.method)} (${currency(props.payload.revenue)})`,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-text-muted">
            Success rate: <span className="font-semibold text-text-heading">{number(payments.successRate || 0)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading">Revenue by Month (12 months)</h3>
          <p className="mb-4 text-sm text-text-muted">Monthly revenue summary.</p>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sales.revenueByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `Rs ${number(v)}`} width={80} />
                <Tooltip formatter={(value) => [currency(value), "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading">Category Performance</h3>
          <p className="mb-4 text-sm text-text-muted">Revenue share by category.</p>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sales.salesByCategory || []}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={({ category }) => category}
                >
                  {(sales.salesByCategory || []).map((entry, index) => (
                    <Cell key={entry.category} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [currency(value), "Revenue"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm xl:col-span-1">
          <h3 className="text-lg font-semibold text-text-heading">Orders by Status</h3>
          <p className="mb-4 text-sm text-text-muted">Current order state distribution.</p>
          <div className="space-y-3">
            {(sales.ordersByStatus || []).map((row) => (
              <div key={row.status} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-sm text-gray-600">{getStatusLabel(row.status)}</p>
                <p className="text-sm font-semibold text-gray-900">{number(row.count)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm xl:col-span-2">
          <h3 className="text-lg font-semibold text-text-heading">Orders by Category (30 days)</h3>
          <p className="mb-4 text-sm text-text-muted">Quantity and revenue by category.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Orders</th>
                  <th className="pb-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {(sales.ordersByCategory || []).map((row) => (
                  <tr key={row.category} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-800">{row.category}</td>
                    <td className="py-3 text-gray-600">{number(row.orders)}</td>
                    <td className="py-3 text-gray-600">{currency(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading">Top Selling Products</h3>
          <p className="mb-4 text-sm text-text-muted">Best performers by quantity sold.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Sold</th>
                  <th className="pb-3">Revenue</th>
                  <th className="pb-3">Stock</th>
                </tr>
              </thead>
              <tbody>
                {(products.topSellingProducts || []).map((row) => (
                  <tr key={row.productId} className="border-b border-gray-100">
                    <td className="py-3 font-medium text-gray-800">{row.name}</td>
                    <td className="py-3 text-gray-600">{number(row.soldQuantity)}</td>
                    <td className="py-3 text-gray-600">{currency(row.revenue)}</td>
                    <td className="py-3 text-gray-600">{number(row.stock)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading">Low Stock Products</h3>
          <p className="mb-4 text-sm text-text-muted">Products needing restock attention.</p>
          <div className="space-y-3">
            {(products.lowStockProducts || []).map((row) => (
              <div key={row.productId} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">{row.name}</p>
                  <p className="text-xs text-gray-500">{row.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600">Stock: {number(row.stock)}</p>
                  <p className="text-xs text-gray-500">{currency(row.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading">Product Revenue Contribution</h3>
          <p className="mb-4 text-sm text-text-muted">Share of total revenue by top products.</p>
          <div className="space-y-4">
            {(products.productRevenueContribution || []).map((row) => (
              <div key={row.productId}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-700">{row.name}</span>
                  <span className="font-medium text-gray-900">{number(row.contributionPercent)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${Math.min(100, row.contributionPercent || 0)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">{currency(row.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border-default bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-heading">Customer Analytics</h3>
          <p className="mb-4 text-sm text-text-muted">Acquisition and retention snapshot.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Total Customers</p>
              <p className="text-lg font-semibold text-gray-900">{number(customers.totalCustomers)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">New This Month</p>
              <p className="text-lg font-semibold text-gray-900">{number(customers.newCustomersThisMonth)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Repeat Customers</p>
              <p className="text-lg font-semibold text-gray-900">{number(customers.repeatCustomers)}</p>
            </div>
          </div>

          <h4 className="mt-6 text-sm font-semibold text-text-heading">Top Customers by Spending</h4>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Orders</th>
                  <th className="pb-3">Spent</th>
                </tr>
              </thead>
              <tbody>
                {(customers.topCustomersBySpending || []).map((row) => (
                  <tr key={row.customerId} className="border-b border-gray-100">
                    <td className="py-3">
                      <p className="font-medium text-gray-800">{row.name}</p>
                      <p className="text-xs text-gray-500">{row.email}</p>
                    </td>
                    <td className="py-3 text-gray-600">{number(row.orderCount)}</td>
                    <td className="py-3 text-gray-600">{currency(row.totalSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
