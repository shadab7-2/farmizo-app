"use client";

import { useEffect, useState } from "react";
import Image from "@/components/common/SafeImage";
import { getMyOrders } from "@/services/order.service";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import OrderTimeline from "@/components/order/OrderTimeline";
import socket from "@/services/socket.service";


export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/orders");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const loadOrders = async () => {
      try {
        const res = await getMyOrders();
        // setOrders(res.data || []);
        // setOrders(res?.data ?? []);
        setOrders(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);
  
  useEffect(() => {
  if (!orders.length) return;

  orders.forEach((order) => {
    socket.emit("joinOrderRoom", order._id);
  });

  socket.on("orderStatusUpdated", (data) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === data.orderId
          ? {
              ...order,
              orderStatus: data.status,
              statusTimeline: data.timeline,
            }
          : order
      )
    );
  });

  return () => {
    socket.off("orderStatusUpdated");
  };
}, [orders]);

  const statusColor = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "delivered":
        return "bg-status-success/10 text-status-success";
      case "confirmed":
      case "shipped":
        return "bg-status-warning/10 text-status-warning";
      case "cancelled":
        return "bg-status-error/10 text-status-error";
      default:
        return "bg-bg-section-muted text-text-muted";
    }
  };

  const formatStatusLabel = (status) => {
    return String(status || "placed")
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (ch) => ch.toUpperCase());
  };

  return (
    <main>
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-text-heading">My Orders</h1>
          <p className="mt-4 text-text-muted">
            Track and review your past purchases
          </p>
        </div>
      </section>

      <section className="bg-bg-page">
        <div className="max-w-5xl mx-auto px-6 py-24 space-y-10">
          {loading && (
            <div className="text-center text-text-muted">
              Fetching your orders...
            </div>
          )}

          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && orders.length === 0 && (
            <p className="text-center text-text-muted">No orders yet.</p>
          )}

          {!loading &&
            orders.map((order) => {
              const currentStatus =
                order.orderStatus || order.status || "placed";
              const total = order.totalAmount ?? order.totalPrice ?? 0;

              return (
                <div
                  key={order._id}
                  className="bg-bg-page p-8 rounded-2xl border border-border-default shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div>
                      <p className="text-sm text-text-muted">Order ID</p>
                      <p className="font-semibold text-text-heading">
                        {order._id.slice(-6)}
                      </p>
                      <p className="mt-1 text-sm text-text-muted">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusColor(
                          currentStatus,
                        )}`}
                      >
                        {formatStatusLabel(currentStatus)}
                      </span>

                      <p className="font-semibold text-text-heading">
                        INR {total}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-5">
                    {order.items?.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <Image
                            src={
                              item.image ||
                              item.product?.images?.[0] ||
                              item.product?.image ||
                              "/placeholder.png"
                            }
                            alt={item.name || item.product?.name || "Product"}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover"
                          />

                          <div className="flex-1">
                            <p className="font-medium text-text-heading">
                              {item.name}
                            </p>
                            <p className="text-sm text-text-muted">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <OrderTimeline timeline={order.statusTimeline || []} currentStatus={order.orderStatus || order.status || "placed"}/>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-text-muted">No items</p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </main>
  );
}
