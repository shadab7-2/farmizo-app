"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Most metro deliveries arrive in 2-4 business days. Plants ship in protective eco packaging.",
  },
  {
    q: "Do you provide plant care help?",
    a: "Yes! Reply to your order email or message us with photos—our experts will guide you.",
  },
  {
    q: "How can I track my order?",
    a: "You’ll get a tracking link once shipped. You can also check status in the Orders section of your account.",
  },
];

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-action-primary font-semibold">
          FAQ
        </p>
        <h2 className="mt-2 text-3xl font-bold text-text-heading">Frequently Asked Questions</h2>
        <p className="mt-2 text-text-muted">Quick answers to common questions.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((item, idx) => {
          const open = openIndex === idx;
          return (
            <button
              key={item.q}
              onClick={() => setOpenIndex(open ? -1 : idx)}
              className="w-full text-left rounded-xl border border-border-default bg-surface-card p-4 shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-semibold text-text-heading">{item.q}</span>
                <ChevronDown className={`text-text-muted transition ${open ? "rotate-180" : ""}`} size={18} />
              </div>
              {open && <p className="mt-2 text-text-muted">{item.a}</p>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
