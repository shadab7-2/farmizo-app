"use client";

export default function PaymentMethod({
  paymentMethod,
  onChange,
  lastPaymentError,
}) {
  return (
    <div className="bg-surface-card p-6 lg:p-8 rounded-2xl border border-border-default shadow-sm">
      <h2 className="text-xl font-bold text-text-heading mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-action-primary/10 text-action-primary flex items-center justify-center text-sm">
          2
        </span>
        Payment Method
      </h2>
      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="paymentMethod"
            value="razorpay"
            checked={paymentMethod === "razorpay"}
            onChange={() => onChange?.("razorpay")}
          />
          <span className="font-medium text-text-heading">Pay Online (Razorpay)</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => onChange?.("cod")}
          />
          <span className="font-medium text-text-heading">Cash on Delivery</span>
        </label>
        {lastPaymentError && (
          <p className="text-sm text-status-error">
            Payment failed: {lastPaymentError} - click Place Order to retry.
          </p>
        )}
      </div>
    </div>
  );
}
