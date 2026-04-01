"use client";

import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <div className="rounded-3xl bg-brand-primary text-text-inverse px-8 py-10 md:px-12 md:py-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-text-inverse/80 font-semibold">
            Need more help?
          </p>
          <h3 className="text-2xl font-bold mt-2">Still have questions?</h3>
          <p className="text-text-inverse/80 mt-1">Our support team is always ready to assist.</p>
        </div>
        <Link
          href="#contact-form"
          className="rounded-full bg-surface-card text-action-primary px-5 py-3 text-sm font-semibold shadow hover:shadow-md transition duration-200"
        >
          Contact Farmizo Support
        </Link>
      </div>
    </section>
  );
}
