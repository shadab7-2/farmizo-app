"use client";
import { useSelector } from "react-redux";

export default function useCart() {
  const items = useSelector((state) => state.cart.items);

  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    items,
    totalQty,
    subtotal,
    isEmpty: items.length === 0,
  };
}
