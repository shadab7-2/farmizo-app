"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const res = await api.get("/admin/orders");
      setOrders(res.data.data);
    };
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/orders/${id}/status`, { status });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="bg-white p-6 rounded shadow mb-4">
          <p>Order ID: {order._id}</p>
          <p>Status: {order.orderStatus}</p>

          <select
            onChange={(e) => updateStatus(order._id, e.target.value)}
            defaultValue={order.orderStatus}
            className="mt-2 border p-2"
          >
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for delivery</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
}