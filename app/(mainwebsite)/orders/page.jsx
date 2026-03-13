"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "@/components/common/SafeImage";
import OrderTimeline from "@/components/order/OrderTimeline";
import InvoiceDownloadButton from "@/components/order/InvoiceDownloadButton";
import { getMyOrders } from "@/services/order.service";
import { RotateCcw, XCircle, Loader2, PackageOpen, Truck, FileDown } from "lucide-react";

const STATUS_OPTIONS = ["all", "placed", "confirmed", "shipped", "delivered", "cancelled"];

const statusChip = {
  placed: "bg-slate-100 text-slate-700",
  confirmed: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const currency = useMemo(
    () => (value) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
      }).format(Number(value || 0)),
    [],
  );

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => (o.orderStatus || o.status) === filter);

  return (
    <main className="bg-bg-page min-h-screen">
      {/* HERO */}
      <section className="bg-bg-section-soft">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-text-heading">My Orders</h1>
          <p className="mt-3 text-text-muted">
            Track your purchases, download invoices, and stay updated.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <div className="max-w-6xl mx-auto px-6 -mt-6 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              filter === option
                ? "bg-action-primary text-white border-action-primary"
                : "bg-white text-text-heading border-border-default hover:border-border-hover"
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-14 space-y-6">
        {loading && (
          <div className="flex items-center justify-center gap-2 text-text-muted">
            <Loader2 className="animate-spin h-5 w-5" />
            Loading your orders...
          </div>
        )}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && filteredOrders.length === 0 && (
          <div className="bg-white border border-dashed border-border-default rounded-2xl p-10 text-center space-y-3">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-bg-section-muted text-action-primary">
              <PackageOpen size={20} />
            </div>
            <p className="text-lg font-semibold text-text-heading">No orders yet</p>
            <p className="text-text-muted">Start shopping to see your orders here.</p>
            <div className="flex justify-center gap-3">
              <Link
                href="/products"
                className="bg-action-primary hover:bg-action-primary-hover text-white px-5 py-3 rounded-xl font-semibold transition"
              >
                Shop Products
              </Link>
              <Link
                href="/categories"
                className="border border-border-default px-5 py-3 rounded-xl font-semibold text-text-heading hover:bg-white transition"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        )}

        {filteredOrders.map((order) => {
          const status = (order.orderStatus || order.status || "placed").toLowerCase();
          const chipClass = statusChip[status] || statusChip.placed;

          return (
            <div
              key={order._id}
              className="bg-white border border-border-default rounded-2xl p-6 shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div>
                  <p className="text-sm text-text-muted">Order ID</p>
                  <p className="text-lg font-semibold text-text-heading">#{order._id.slice(-6)}</p>
                  <p className="text-sm text-text-muted">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${chipClass}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Total</p>
                    <p className="text-xl font-bold text-text-heading">
                      {currency(order.totalAmount || order.totalPrice || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="mt-6 grid lg:grid-cols-3 gap-6">
                {/* Items list */}
                <div className="lg:col-span-2 space-y-3">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 rounded-xl border border-border-default p-3 bg-bg-page"
                    >
                      <Image
                        src={item.image || item.product?.images?.[0] || "/placeholder.png"}
                        alt={item.name || item.product?.name || "Order item"}
                        width={70}
                        height={70}
                        className="rounded-lg object-cover border border-border-default"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-heading truncate">{item.name}</p>
                        <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-text-heading whitespace-nowrap">
                        {currency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Compact timeline & summary */}
                <div className="space-y-4">
                  <div className="rounded-xl border border-border-default p-3 bg-bg-section-soft">
                    <p className="text-sm font-semibold text-text-heading mb-2">Status timeline</p>
                    <OrderTimeline
                      timeline={order.timeline || order.statusTimeline || []}
                      currentStatus={status}
                    />
                  </div>

                  <div className="rounded-xl border border-border-default p-3 bg-bg-page space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Items</span>
                      <span className="font-semibold text-text-heading">{order.items?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Total</span>
                      <span className="font-semibold text-text-heading">
                        {currency(order.totalAmount || order.totalPrice || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3 justify-between">
                <div className="flex flex-wrap gap-3">
                  <InvoiceDownloadButton
                    orderId={order._id}
                    mode="preview"
                    label="View Invoice"
                    className="flex items-center gap-2 border border-border-default px-4 py-2 rounded-lg bg-white hover:bg-bg-section-muted transition"
                  />
                  <InvoiceDownloadButton
                    orderId={order._id}
                    label="Download PDF"
                    className="flex items-center gap-2 border border-border-default px-4 py-2 rounded-lg bg-white hover:bg-bg-section-muted transition"
                  />

                  <button
                    onClick={() => console.log("Reorder items", order.items)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-default text-text-heading hover:bg-bg-section-muted transition"
                    type="button"
                  >
                    <RotateCcw size={16} />
                    Reorder
                  </button>

                  {status === "placed" && (
                    <button
                      onClick={() => console.log("Cancel order", order._id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                      type="button"
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  )}
                </div>

                <Link
                  href={`/order-success?orderId=${order._id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-action-primary text-white hover:bg-action-primary-hover transition"
                >
                  <Truck size={16} />
                  Track Delivery
                </Link>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
