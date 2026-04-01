"use client";

import { Phone, Mail, MapPin } from "lucide-react";

const cards = [
  { icon: Phone, title: "Call Us", text: "+91 999 999 9999" },
  { icon: Mail, title: "Email Us", text: "support@farmizo.com" },
  { icon: MapPin, title: "Our Location", text: "Mumbai, India" },
];

export default function ContactInfoCards() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-border-default bg-surface-card shadow-md hover:shadow-lg transition duration-200 p-5 flex items-start gap-4"
          >
            <div className="h-12 w-12 rounded-xl bg-bg-section-soft text-action-primary flex items-center justify-center">
              <card.icon size={22} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-heading">{card.title}</h3>
              <p className="text-text-muted mt-1">{card.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
