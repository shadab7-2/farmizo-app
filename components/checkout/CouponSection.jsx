"use client";

export default function CouponSection({
  couponCode,
  onCodeChange,
  couponError,
  couponSuccess,
  couponLoading,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) {
  return (
    <div className="mt-6 pt-6 border-t border-border-default">
      <label className="block text-sm font-medium text-text-heading mb-2">
        Discount Coupon
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => onCodeChange?.(e.target.value)}
          placeholder="Enter Code"
          disabled={couponLoading || !!appliedCoupon}
          className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-border-default bg-surface-card focus:ring-2 focus:ring-action-primary/50 outline-none uppercase disabled:opacity-60 disabled:bg-bg-page"
        />
        <button
          type="button"
          onClick={onApplyCoupon}
          disabled={couponLoading || !!appliedCoupon || !couponCode.trim()}
          className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-action-primary text-text-inverse hover:bg-action-primary-hover disabled:opacity-50 transition duration-200"
        >
          {couponLoading ? "Wait..." : "Apply"}
        </button>
      </div>

      {appliedCoupon?.code && (
        <div className="mt-3 flex items-center justify-between bg-status-success/10 border border-status-success/30 px-3 py-2 rounded-lg">
          <span className="text-xs font-semibold text-status-success font-mono">
            {appliedCoupon.code}
          </span>
          <button
            type="button"
            onClick={onRemoveCoupon}
            className="text-xs font-medium text-status-error hover:text-status-error underline"
          >
            Remove
          </button>
        </div>
      )}
      {couponSuccess && !appliedCoupon && (
        <p className="mt-2 text-xs font-medium text-status-success flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {couponSuccess}
        </p>
      )}
      {couponError && (
        <p className="mt-2 text-xs font-medium text-status-error flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {couponError}
        </p>
      )}
    </div>
  );
}
