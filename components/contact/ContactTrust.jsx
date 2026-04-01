"use client";

import { Truck, ShieldCheck, Headphones } from "lucide-react";

const trustItems = [
  { icon: Truck, title: "Fast Delivery", desc: "Eco-friendly packing, quick dispatch." },
  { icon: ShieldCheck, title: "Healthy Plants Guarantee", desc: "Arrives fresh or we replace it." },
  { icon: Headphones, title: "24/7 Support", desc: "Plant experts ready to help anytime." },
];

export default function ContactTrust() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trustItems.map((item) => (
          <div key={item.title} className="rounded-xl border border-border-default bg-bg-section-soft p-5 shadow-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bg-section-soft text-action-primary">
              <item.icon size={20} />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-text-heading">{item.title}</h3>
            <p className="mt-2 text-sm text-text-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
