"use client";

const formatMoney = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const statusClasses = {
  placed: "bg-slate-100 text-slate-700",
  confirmed: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const formatStatus = (status = "") =>
  String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

export default function RecentOrders({ orders = [], onStatusChange }) {
  return (
    <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-heading">Recent Orders</h3>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border-default text-left text-text-muted">
            <tr>
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Total</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-text-muted">
                  No recent orders
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-3 font-medium text-text-heading">#{String(order._id).slice(-6)}</td>
                  <td className="py-3">{order.customerName || "Guest"}</td>
                  <td className="py-3">{formatMoney(order.totalAmount)}</td>
                  <td className="py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => onStatusChange?.(order._id, e.target.value)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${statusClasses[order.orderStatus] || "bg-slate-100 text-slate-700"}`}
                    >
                      {Object.keys(statusClasses).map((status) => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 text-text-muted">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
