"use client";

import Image from "@/components/common/SafeImage";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";

import {
  updateCartItem,
  removeCartItem,
  loadCart,
} from "@/store/slices/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();

  /* ================= REDUX STATE ================= */
  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated } = useSelector((state) => state.auth);

  /* ================= LOAD CART FROM DB ================= */
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadCart());
    }
  }, [dispatch, isAuthenticated]);

  /* ================= CALCULATIONS ================= */
  const currency = useMemo(
    () => (value) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
      }).format(Number(value || 0)),
    [],
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 60;
  const total = subtotal + shipping;
  const freeShipLeft = Math.max(0, 500 - subtotal);

  /* ================= UI ================= */
  return (
    <main>
      {/* ================= HEADER ================= */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-text-heading">Your Cart</h1>
          <p className="mt-3 text-text-muted">
            {totalItems > 0
              ? `You have ${totalItems} item${totalItems > 1 ? "s" : ""} ready to order.`
              : "Review items you love and head to checkout."}
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-12">
          {/* LEFT — CART ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-dashed border-border-default bg-white">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-bg-section-muted text-action-primary">
                  <ShoppingBag size={24} />
                </div>
                <p className="text-lg font-semibold text-text-heading">Your cart is empty</p>
                <p className="text-text-muted mt-1">Add some plants and grow your collection.</p>

                <div className="mt-6 flex justify-center gap-3">
                  <Link
                    href="/products"
                    className="bg-action-primary hover:bg-action-primary-hover text-text-inverse px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Start Shopping
                  </Link>
                  <Link
                    href="/categories"
                    className="border border-border-default px-6 py-3 rounded-xl font-semibold text-text-heading hover:bg-bg-section-muted transition"
                  >
                    Explore Categories
                  </Link>
                </div>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemId = item._id || item.productId || item.product;
                const lineTotal = item.price * item.quantity;

                return (
                  <div
                    key={itemId}
                    className="flex flex-col sm:flex-row gap-6 bg-white p-5 rounded-2xl border border-border-default shadow-sm"
                  >
                    {/* IMAGE */}
                    <Image
                      src={item.images?.[0] || "/placeholder.png"}
                      alt={item.name}
                      width={110}
                      height={110}
                      className="rounded-xl object-cover border border-border-default"
                    />

                    {/* INFO */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-text-heading">{item.name}</h3>
                          <p className="text-sm text-text-muted">Price: {currency(item.price)}</p>
                        </div>
                        <button
                          onClick={() => dispatch(removeCartItem(itemId))}
                          className="text-status-error hover:opacity-80 transition"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* QTY */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            dispatch(
                              updateCartItem({
                                productId: itemId,
                                quantity: Math.max(1, item.quantity - 1),
                              }),
                            )
                          }
                          disabled={item.quantity === 1}
                          className="p-2 rounded-lg border border-border-default hover:bg-bg-section-muted transition disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="font-semibold text-text-heading">{item.quantity}</span>

                        <button
                          onClick={() =>
                            dispatch(
                              updateCartItem({
                                productId: itemId,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                          className="p-2 rounded-lg border border-border-default hover:bg-bg-section-muted transition"
                        >
                          <Plus size={16} />
                        </button>

                        <span className="ml-auto text-sm font-semibold text-text-heading">
                          {currency(lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT — SUMMARY */}
          <div className="bg-bg-section-muted p-7 rounded-2xl border border-border-default shadow-sm h-fit space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text-heading">Order Summary</h2>
              <p className="text-sm text-text-muted mt-1">
                {totalItems} item{totalItems !== 1 ? "s" : ""} in your bag
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-text-heading">{currency(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-text-heading">
                  {shipping === 0 ? "Free" : currency(shipping)}
                </span>
              </div>

              <div className="border-t border-border-default pt-4 flex justify-between text-base font-bold text-text-heading">
                <span>Total</span>
                <span className="text-action-primary">{currency(total)}</span>
              </div>

              {shipping > 0 ? (
                <p className="text-xs text-text-muted">
                  Add items worth {currency(freeShipLeft)} more to unlock free shipping.
                </p>
              ) : (
                <p className="text-xs text-green-700 font-medium">You unlocked free shipping!</p>
              )}
            </div>

            {/* PROTECTED CHECKOUT */}
            <Link
              href={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"}
              className="block text-center bg-action-primary hover:bg-action-primary-hover text-text-inverse py-3 rounded-xl font-semibold transition shadow-sm shadow-action-primary/10"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block text-center border border-border-default py-3 rounded-xl font-semibold text-text-heading hover:bg-white transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
