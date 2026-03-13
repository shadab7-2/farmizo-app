"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Truck, FileDown, ShoppingBag } from "lucide-react";
import InvoiceDownloadButton from "@/components/order/InvoiceDownloadButton";

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <main className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* SUCCESS HEADER */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <CheckCircle size={48} className="mx-auto text-green-600" />

          <h1 className="text-3xl font-bold text-green-700 mt-4">
            Order Confirmed!
          </h1>

          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your order has been placed successfully.
          </p>

          {orderId && (
            <p className="mt-4 text-sm text-gray-700">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          )}
        </div>

        {/* ORDER DETAILS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-10 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Order Details
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <p className="text-gray-500">Order Date</p>
              <p className="font-medium">
                {new Date().toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium">Online Payment</p>
            </div>

            <div>
              <p className="text-gray-500">Order Status</p>
              <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                Processing
              </span>
            </div>

            <div>
              <p className="text-gray-500">Estimated Delivery</p>
              <p className="font-medium">3 - 5 days</p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <Link
            href="/orders"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Truck size={18} />
            Track Order
          </Link>

          {orderId ? (
            <InvoiceDownloadButton
              orderId={orderId}
              label="Download Invoice"
              className="flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            />
          ) : (
            <button
              className="flex items-center gap-2 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
              type="button"
              disabled
            >
              <FileDown size={18} />
              Download Invoice
            </button>
          )}

          <Link
            href="/products"
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>

        {/* TRUST SECTION */}
        <div className="mt-14 text-center text-sm text-gray-600">
          <p>
            ✔ Secure Payment &nbsp;&nbsp;
            ✔ Fast Delivery &nbsp;&nbsp;
            ✔ Customer Support Available
          </p>
        </div>
      </div>
    </main>
  );
}
