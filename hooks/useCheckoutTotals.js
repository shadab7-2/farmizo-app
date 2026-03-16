"use client";

import { useMemo } from "react";

export  function useCheckoutTotals(cartItems = [], appliedCoupon = null) {
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const shipping = subtotal > 500 ? 0 : 60;
  const discount = useMemo(
    () => Math.min(appliedCoupon?.discount || 0, subtotal),
    [appliedCoupon, subtotal],
  );
  const total = useMemo(
    () => Math.max(subtotal - discount, 0) + shipping,
    [subtotal, discount, shipping],
  );

  return { subtotal, shipping, discount, total };
}
