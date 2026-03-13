import OrderStatusDropdown from "./OrderStatusDropdown";
import {
  STATUS_BADGE_CLASSES,
  formatCurrency,
  formatDate,
  formatOrderStatus,
} from "./orderUtils";

const getCustomerName = (order) =>
  order?.user?.name || order?.shippingAddress?.fullName || "-";

const getCustomerEmail = (order) =>
  order?.user?.email || order?.shippingAddress?.email || "-";

const getItemsCount = (order) =>
  Array.isArray(order?.items)
    ? order.items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
    : 0;

const getOrderCode = (id) => `#${String(id || "").slice(-6).toUpperCase()}`;

export default function OrderTable({
  orders,
  statusUpdatingId,
  onStatusChange,
  onView,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Items Count</th>
              <th className="px-4 py-3">Total Amount</th>
              <th className="px-4 py-3">Payment Method</th>
              <th className="px-4 py-3">Order Status</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-t border-gray-100 transition hover:bg-green-50/40"
              >
                <td className="px-4 py-3 font-medium text-gray-900" title={order._id}>
                  {getOrderCode(order._id)}
                </td>
                <td className="px-4 py-3">{getCustomerName(order)}</td>
                <td className="px-4 py-3 text-gray-600">{getCustomerEmail(order)}</td>
                <td className="px-4 py-3">{getItemsCount(order)}</td>
                <td className="px-4 py-3 font-semibold">
                  {formatCurrency(order?.finalAmount || order?.totalAmount || 0)}
                </td>
                <td className="px-4 py-3 uppercase">{order?.paymentMethod || "COD"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        STATUS_BADGE_CLASSES[order?.orderStatus] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {formatOrderStatus(order?.orderStatus)}
                    </span>
                    <OrderStatusDropdown
                      value={order?.orderStatus || "placed"}
                      disabled={statusUpdatingId === order._id}
                      onChange={(nextStatus) => onStatusChange(order._id, nextStatus)}
                    />
                  </div>
                </td>
                <td className="px-4 py-3">{formatDate(order?.createdAt)}</td>
                <td className="px-4 py-3">
                  <button
                    className="rounded-md border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-50"
                    onClick={() => onView(order._id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!orders.length && (
        <div className="p-6 text-center text-sm text-gray-500">No orders found.</div>
      )}
    </div>
  );
}
