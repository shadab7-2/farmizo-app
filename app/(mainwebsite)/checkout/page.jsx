"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/common/SafeImage";

import { clearCartAsync } from "@/store/slices/cartSlice";
import { createOrder } from "@/services/order.service";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shipping = subtotal > 500 ? 0 : 60;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async (e) => {
    e?.preventDefault();
    if(!form.fullName || !form.phone || !form.email || !form.address || !form.city || !form.postalCode){
      alert("Please fill all the shiping details ")
    }
    try {
      setLoading(true);

      const payload = {
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
        },
      };

      await createOrder(payload);

      dispatch(clearCartAsync());

      router.push("/order-success");
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* ================= HEADER ================= */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-bold text-text-heading">Checkout</h1>

          <p className="mt-4 text-text-muted">
            Complete your order safely and securely.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-3 gap-16">
          {/* LEFT — FORM */}
          <div className="lg:col-span-2 bg-bg-page p-8 rounded-2xl border border-border-default shadow-sm">
            <h2 className="text-2xl font-bold text-text-heading">
              Shipping Details
            </h2>

            <form
              id="checkout-form"
              onSubmit={placeOrder}
              className="mt-8 grid sm:grid-cols-2 gap-6"
            >
              {[
                {
                  label: "Full Name",
                  name: "fullName",
                  type: "text",
                },
                {
                  label: "Phone Number",
                  name: "phone",
                  type: "tel",
                },
                {
                  label: "Email Address",
                  name: "email",
                  type: "email",
                },
                {
                  label: "City",
                  name: "city",
                  type: "text",
                },
                {
                  label: "Postal Code",
                  name: "postalCode",
                  type: "text",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-text-heading">
                    {field.label}
                  </label>

                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full px-4 py-3 rounded-xl border border-border-default bg-bg-page outline-none focus:ring-2 focus:ring-action-primary"
                  />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-heading">
                  Address
                </label>

                <textarea
                  rows="3"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-border-default bg-bg-page outline-none focus:ring-2 focus:ring-action-primary"
                />
              </div>
            </form>
          </div>

          {/* RIGHT — SUMMARY */}
          <div className="bg-bg-section-muted p-8 rounded-2xl border border-border-default shadow-sm h-fit">
            <h2 className="text-xl font-bold text-text-heading">
              Order Summary
            </h2>

            <div className="mt-6 space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-4 items-center">
                  <Image
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-text-heading">{item.name}</p>

                    <p className="text-sm text-text-muted">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <span className="font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

              <div className="border-t border-border-default pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>

                <div className="flex justify-between font-semibold text-text-heading">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <button
              // onClick={placeOrder}
              type="submit"
              form="checkout-form"
              disabled={loading || cartItems.length === 0}
              className="mt-8 w-full bg-action-primary hover:bg-action-primary-hover text-text-inverse py-3 rounded-xl font-semibold transition disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
