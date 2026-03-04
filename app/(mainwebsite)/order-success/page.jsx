"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <main className="bg-bg-page">

      <section className="max-w-3xl mx-auto px-6 py-32 text-center">

        <CheckCircle
          className="mx-auto text-status-success"
          size={80}
        />

        <h1 className="mt-6 text-4xl font-bold text-text-heading">
          Order Placed Successfully! 🌱
        </h1>

        <p className="mt-4 text-text-muted">
          Thank you for shopping with
          Farmizo. Your plants are on
          their way!
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">

          <Link
            href="/products"
            className="bg-action-primary hover:bg-action-primary-hover text-text-inverse px-8 py-4 rounded-xl font-semibold transition"
          >
            Continue Shopping
          </Link>

          <Link
            href="/orders"
            className="border border-border-default px-8 py-4 rounded-xl font-semibold hover:bg-bg-section-muted transition"
          >
            View Orders
          </Link>

        </div>

      </section>

    </main>
  );
}
