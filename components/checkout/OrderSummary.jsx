"use client";

import Image from "@/components/common/SafeImage";

export default function OrderSummary({
  cartItems = [],
  deliveryDays,
  formatMoney,
  couponCode,
  setCouponCode,
  couponError,
  couponSuccess,
  couponLoading,
  appliedCoupon,
  handleApplyCoupon,
  removeAppliedCoupon,
  subtotal,
  discount,
  shipping,
  total,
  isSubmitDisabled,
  loading,
  paymentMethod,
  submitError,
}) {
  return (
    <div className="lg:col-span-5 xl:col-span-4">
      <div className="sticky top-24 bg-bg-section-muted p-6 lg:p-8 rounded-2xl border border-border-default shadow-sm">
        <h2 className="text-xl font-bold text-text-heading mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-action-primary/10 text-action-primary flex items-center justify-center text-sm">
            3
          </span>
          Order Summary
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-3 py-3">
            <span className="text-lg">🚚</span>
            <div>
              <p className="text-sm font-semibold text-text-heading">Estimated Delivery</p>
              <div className="text-sm text-green-600">
                Delivered in {deliveryDays}-{deliveryDays + 2} business days
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mt-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 items-start bg-white p-3 rounded-xl border border-border-default"
            >
              <Image
                src={item.images?.[0] || "/placeholder.png"}
                alt={item.name}
                width={56}
                height={56}
                className="rounded-lg object-cover flex-shrink-0 border border-border-default"
              />

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-heading text-sm truncate">
                  {item.name}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  Qty: {item.quantity}
                </p>
                <p className="text-sm font-bold text-action-primary mt-1">
                  Rs. {formatMoney(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Section */}
        <div className="mt-6 pt-6 border-t border-border-default">
          <label className="block text-sm font-medium text-text-heading mb-2">
            Discount Coupon
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                if (couponError) setCouponError?.("");
                if (couponSuccess) setCouponSuccess?.("");
              }}
              placeholder="Enter Code"
              disabled={couponLoading || !!appliedCoupon}
              className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-border-default bg-white focus:ring-2 focus:ring-action-primary/50 outline-none uppercase disabled:opacity-60 disabled:bg-bg-page"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={
                couponLoading || !!appliedCoupon || !couponCode.trim()
              }
              className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-text-heading text-white hover:bg-black disabled:opacity-50 transition"
            >
              {couponLoading ? "Wait..." : "Apply"}
            </button>
          </div>

          {appliedCoupon?.code && (
            <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
              <span className="text-xs font-semibold text-green-700 font-mono">
                {appliedCoupon.code}
              </span>
              <button
                type="button"
                onClick={removeAppliedCoupon}
                className="text-xs font-medium text-red-600 hover:text-red-800 underline"
              >
                Remove
              </button>
            </div>
          )}
          {couponSuccess && !appliedCoupon && (
            <p className="mt-2 text-xs font-medium text-green-600 flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {couponSuccess}
            </p>
          )}
          {couponError && (
            <p className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {couponError}
            </p>
          )}
        </div>

        {/* Price Calculation */}
        <div className="mt-6 border-t border-border-default pt-5 space-y-3">
          <div className="flex justify-between text-sm text-text-muted">
            <span>Subtotal</span>
            <span className="font-medium text-text-heading">
              Rs. {formatMoney(subtotal)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-medium">
              <span>Discount applied</span>
              <span>-Rs. {formatMoney(discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm text-text-muted">
            <span>Shipping Fee</span>
            <span className="font-medium text-text-heading">
              {shipping === 0 ? "Free" : `Rs. ${formatMoney(shipping)}`}
            </span>
          </div>

          <div className="flex justify-between items-end pt-3 text-lg font-bold text-text-heading border-t border-border-default border-dashed">
            <span>Total Payable</span>
            <span className="text-xl text-action-primary">
              Rs. {formatMoney(total)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          form="checkout-form"
          disabled={isSubmitDisabled}
          className="mt-8 w-full bg-action-primary hover:bg-action-primary-hover text-white py-4 rounded-xl font-bold text-lg shadow-md shadow-action-primary/20 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing Order...
            </>
          ) : (
            <>
              {paymentMethod === "cod" ? "Place Order (COD)" : "Confirm & Pay"}
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          )}
        </button>

        {submitError && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-red-700 font-medium">
              {submitError}
            </p>
          </div>
        )}

        <p className="mt-4 text-xs text-center text-text-muted flex items-center justify-center gap-1.5">
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4"
            />
          </svg>
          Payments secured by Razorpay. Cash on Delivery available for eligible pincodes.
        </p>
      </div>
    </div>
  );
}
