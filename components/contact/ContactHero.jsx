"use client";

import Link from "next/link";
import Image from "@/components/common/SafeImage";

export default function ContactHero() {
  return (
    <section className="bg-gradient-to-r from-bg-section-soft via-bg-page to-bg-section-soft">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.25em] text-action-primary font-semibold">
            We’re here to help
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-text-heading">
            Get in Touch with Farmizo
          </h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto md:mx-0">
            We’re here to help you grow your green space 🌿. Reach out for plant care, orders, or partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="#contact-form"
              className="rounded-full bg-action-primary px-6 py-3 text-text-inverse text-sm font-semibold shadow-lg shadow-action-primary/30 hover:bg-action-primary-hover transition duration-200"
            >
              Send a Message
            </Link>
            <Link
              href="tel:+919999999999"
              className="rounded-full border border-border-default px-6 py-3 text-sm font-semibold text-text-heading hover:border-action-primary/50 hover:text-action-primary transition duration-200"
            >
              Call Us
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-brand-secondary/30 blur-3xl opacity-60" />
          <div className="absolute right-0 -bottom-8 h-28 w-28 rounded-full bg-brand-accent/35 blur-3xl opacity-60" />
          <Image
            src="https://images.unsplash.com/photo-1692364043097-694650027191?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Plants and gardening contact"
            width={520}
            height={400}
            className="relative rounded-3xl shadow-2xl object-cover w-full h-[420px]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
