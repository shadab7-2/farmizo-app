import { useState } from "react";
import Image from "next/image";
import { X, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { resendInvoiceEmail } from "@/services/order.service";
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

const getOrderNotes = (order) =>
  order?.orderNotes && order.orderNotes.trim() !== ""
    ? order.orderNotes
    : "No special instructions";

export default function OrderDetailsModal({ isOpen, loading, order, onClose }) {
  const [resending, setResending] = useState(false);

  if (!isOpen) return null;

  const paymentStatusClass =
    order?.paymentStatus === "paid"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";

  const handleResendInvoice = async () => {
    if (!order?._id) return;
    setResending(true);
    try {
      await resendInvoiceEmail(order._id);
      toast.success("Invoice email sent successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to send invoice email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Loading order details...</div>
        ) : !order ? (
          <div className="py-16 text-center text-sm text-red-600">Order details not available.</div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-100 p-4">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Order Information
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Order ID: <span className="font-medium">{order._id}</span></p>
                  <p>Order Date: <span className="font-medium">{formatDate(order.createdAt)}</span></p>
                  <p>Payment Method: <span className="font-medium uppercase">{order.paymentMethod || "COD"}</span></p>
                  <p>
                    Payment Status:{" "}
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${paymentStatusClass}`}>
                      {order.paymentStatus || "pending"}
                    </span>
                  </p>
                  <p>
                    Order Status:{" "}
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        STATUS_BADGE_CLASSES[order.orderStatus] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {formatOrderStatus(order.orderStatus)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 p-4">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Name: <span className="font-medium">{getCustomerName(order)}</span></p>
                  <p>Email: <span className="font-medium">{getCustomerEmail(order)}</span></p>
                  <p>Phone: <span className="font-medium">{order?.shippingAddress?.phone || "-"}</span></p>
                  <p>
                    Shipping Address:{" "}
                    <span className="font-medium">
                      {order?.shippingAddress?.address || "-"}, {order?.shippingAddress?.city || "-"},{" "}
                      {order?.shippingAddress?.pincode || "-"}
                    </span>
                  </p>
                  <p>
                    Order Notes:{" "}
                    <span className="font-medium">{getOrderNotes(order)}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100">
              <div className="border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Products Ordered
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left">Product Image</th>
                      <th className="px-4 py-3 text-left">Product Name</th>
                      <th className="px-4 py-3 text-left">Quantity</th>
                      <th className="px-4 py-3 text-left">Price</th>
                      <th className="px-4 py-3 text-left">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item, index) => (
                      <tr key={`${item.product?._id || index}`} className="border-t border-gray-100">
                        <td className="px-4 py-3">
                          <Image
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name || "Product"}
                            width={56}
                            height={56}
                            unoptimized
                            className="h-14 w-14 rounded border border-gray-200 object-cover"
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.name || item.product?.name || "-"}
                        </td>
                        <td className="px-4 py-3">{item.quantity || 0}</td>
                        <td className="px-4 py-3">{formatCurrency(item.price || 0)}</td>
                        <td className="px-4 py-3 font-semibold">
                          {formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end border-t border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-gray-800">
                  Total: {formatCurrency(order.finalAmount || order.totalAmount || 0)}
                </p>
              </div>
            </div>

            {/* Resend Invoice Email Button */}
            <div className="flex justify-end">
              <button
                onClick={handleResendInvoice}
                disabled={resending}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
              >
                {resending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Resend Invoice Email
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
