"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAdminOrderById,
  getAdminOrders,
  updateAdminOrderStatus,
} from "@/services/order.service";
import OrderStats from "./components/OrderStats";
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import OrderDetailsModal from "./components/OrderDetailsModal";

const PAGE_SIZE = 10;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, dateFilter]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminOrders({
        page,
        limit: PAGE_SIZE,
        search: searchQuery,
        status: statusFilter,
        dateFilter,
      });

      setOrders(response.orders);
      setSummary(response.summary);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, page, searchQuery, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateStatus = async (id, status) => {
    setStatusUpdatingId(id);
    setError("");

    try {
      await updateAdminOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, orderStatus: status } : order,
        ),
      );

      if (selectedOrder?._id === id) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, orderStatus: status } : prev,
        );
      }

      await loadOrders();
    } catch (err) {
      setError(err.message || "Failed to update order status");
    } finally {
      setStatusUpdatingId("");
    }
  };

  const openOrderDetails = async (id) => {
    setIsDetailsOpen(true);
    setDetailsLoading(true);
    setSelectedOrder(null);

    try {
      const order = await getAdminOrderById(id);
      setSelectedOrder(order);
    } catch (err) {
      setError(err.message || "Failed to load order details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeOrderDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  };

  const pageNumbers = useMemo(() => {
    const totalPages = Math.max(1, Number(pagination.totalPages || 1));
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);

    for (let current = start; current <= end; current += 1) {
      pages.push(current);
    }

    return pages;
  }, [page, pagination.totalPages]);

  return (
    <div className=" space-y-6">
      <div>
        <span>
          <h1 className="text-3xl font-bold text-text-heading">
            Orders Management
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Review, filter, and update customer orders from one dashboard.
          </p>
        </span>
      </div>

      <OrderStats summary={summary} loading={loading} />

      <OrderFilters
        search={searchInput}
        onSearchChange={setSearchInput}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-gray-100 bg-white py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      ) : (
        <>
          <OrderTable
            orders={orders}
            statusUpdatingId={statusUpdatingId}
            onStatusChange={updateStatus}
            onView={openOrderDetails}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              Showing {(page - 1) * PAGE_SIZE + (orders.length ? 1 : 0)}-
              {(page - 1) * PAGE_SIZE + orders.length} of{" "}
              {pagination.totalItems} orders
            </p>

            <div className="flex items-center gap-2">
              <button
                className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-50"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
              >
                Previous
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`rounded-md px-3 py-1.5 text-sm ${
                    pageNumber === page
                      ? "bg-green-600 text-white"
                      : "border border-gray-200 text-gray-700"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-50"
                onClick={() =>
                  setPage((prev) =>
                    Math.min(Number(pagination.totalPages || 1), prev + 1),
                  )
                }
                disabled={page >= Number(pagination.totalPages || 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <OrderDetailsModal
        isOpen={isDetailsOpen}
        loading={detailsLoading}
        order={selectedOrder}
        onClose={closeOrderDetails}
      />
    </div>
  );
}
