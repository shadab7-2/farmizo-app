"use client";

import Image from "@/components/common/SafeImage";
import CouponSection from "@/components/checkout/CouponSection";

export default function OrderSummary({
  cartItems = [],
  deliveryDays,
  formatMoney,
  couponCode,
  onCouponCodeChange,
  couponError,
  couponSuccess,
  couponLoading,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
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
          <div className="flex items-start gap-3 rounded-xl border border-status-success/30 bg-status-success/10 px-3 py-3">
            <span className="text-lg">🚚</span>
            <div>
              <p className="text-sm font-semibold text-text-heading">Estimated Delivery</p>
              <div className="text-sm text-status-success">
                Delivered in {deliveryDays}-{deliveryDays + 2} business days
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mt-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 items-start bg-surface-card p-3 rounded-xl border border-border-default"
            >
              <Image
                src={item.images?.[0] || "/placeholder.png"}
                alt={item.name}
                width={56}
                height={56}
                className="rounded-lg object-cover `flex-shrink-0` border border-border-default"
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

        <CouponSection
          couponCode={couponCode}
          onCodeChange={onCouponCodeChange}
          couponError={couponError}
          couponSuccess={couponSuccess}
          couponLoading={couponLoading}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={onApplyCoupon}
          onRemoveCoupon={onRemoveCoupon}
        />

        {/* Price Calculation */}
        <div className="mt-6 border-t border-border-default pt-5 space-y-3">
          <div className="flex justify-between text-sm text-text-muted">
            <span>Subtotal</span>
            <span className="font-medium text-text-heading">
              Rs. {formatMoney(subtotal)}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm text-status-success font-medium">
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
          className="mt-8 w-full bg-action-primary hover:bg-action-primary-hover text-text-inverse py-4 rounded-xl font-bold text-lg shadow-md shadow-action-primary/20 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-text-inverse"
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
          <div className="mt-4 p-3 rounded-lg bg-status-error/10 border border-status-error/30 flex items-start gap-2">
            <svg
              className="w-5 h-5 text-status-error mt-0.5"
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
            <p className="text-sm text-status-error font-medium">
              {submitError}
            </p>
          </div>
        )}

        <p className="mt-4 text-xs text-center text-text-muted flex items-center justify-center gap-1.5">
          <svg
            className="w-4 h-4 text-status-success"
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
