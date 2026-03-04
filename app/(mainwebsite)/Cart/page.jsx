"use client";

import Image from "@/components/common/SafeImage";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

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
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 500 ? 0 : 60;
  const total = subtotal + shipping;

  /* ================= UI ================= */
  return (
    <main>
      {/* ================= HEADER ================= */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-text-heading">
            Your Cart
          </h1>

          <p className="mt-4 text-text-muted">
            Review your items before checkout.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-3 gap-16">

          {/* LEFT — CART ITEMS */}
          <div className="lg:col-span-2 space-y-8">

            {cartItems.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-lg text-text-muted">
                  Your cart is empty 🌱
                </p>

                <Link
                  href="/products"
                  className="inline-block mt-6 bg-action-primary hover:bg-action-primary-hover text-text-inverse px-8 py-4 rounded-xl font-semibold transition"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product?._id || item.product || item._id}
                  className="flex flex-col sm:flex-row gap-6 bg-bg-page p-6 rounded-2xl border border-border-default shadow-sm"
                >
                  {/* IMAGE */}
                  <Image
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="rounded-xl object-cover"
                  />

                  {/* INFO */}
                  <div className="flex-1">

                    <h3 className="text-lg font-semibold text-text-heading">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-text-muted">
                      ₹{item.price} each
                    </p>

                    {/* QTY */}
                    <div className="mt-4 flex items-center gap-3">

                      {/* DECREASE */}
                      <button
                        onClick={() =>
                          dispatch(
                            updateCartItem({
                              productId: item._id,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        disabled={item.quantity === 1}
                        className="p-2 rounded-lg border border-border-default hover:bg-bg-section-muted transition"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="font-medium">
                        {item.quantity}
                      </span>

                      {/* INCREASE */}
                      <button
                        onClick={() =>
                          dispatch(
                            updateCartItem({
                              productId: item._id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="p-2 rounded-lg border border-border-default hover:bg-bg-section-muted transition"
                      >
                        <Plus size={16} />
                      </button>

                    </div>

                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() =>
                      dispatch(removeCartItem(item._id))
                    }
                    className="text-status-error hover:opacity-80 transition"
                  >
                    <Trash2 />
                  </button>

                </div>
              ))
            )}

          </div>

          {/* RIGHT — SUMMARY */}
          <div className="bg-bg-section-muted p-8 rounded-2xl border border-border-default shadow-sm h-fit">

            <h2 className="text-xl font-bold text-text-heading">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>

              <div className="border-t border-border-default pt-4 flex justify-between font-semibold text-text-heading">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

            </div>

            {/* PROTECTED CHECKOUT */}
            <Link
              href={
                isAuthenticated
                  ? "/checkout"
                  : "/login?redirect=/checkout"
              }
              className="mt-8 block text-center bg-action-primary hover:bg-action-primary-hover text-text-inverse py-3 rounded-xl font-semibold transition"
            >
              Proceed to Checkout
            </Link>

          </div>

        </div>
      </section>
    </main>
  );
}
