"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold text-text-heading">Contact Us</h1>

          <p className="mt-6 text-lg text-text-body max-w-2xl mx-auto">
            Have questions about plants, orders, or partnerships? Our team is
            here to help 🌱
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-20">
          {/* LEFT — INFO */}
          <div className="space-y-10">
            <div className="flex items-start gap-4">
              <MapPin className="text-action-primary" />
              <div>
                <h3 className="font-semibold text-text-heading">
                  Office Address
                </h3>
                <p className="text-text-body">Mumbai, Maharashtra, India</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="text-action-primary" />
              <div>
                <h3 className="font-semibold text-text-heading">Phone</h3>
                <p className="text-text-body">+91 9XXXXXXXXX</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="text-action-primary" />
              <div>
                <h3 className="font-semibold text-text-heading">Email</h3>
                <p className="text-text-body">support@farmizo.com</p>
              </div>
            </div>
          </div>

          {/* RIGHT — FORM */}
          <div className="bg-bg-section-muted p-10 rounded-2xl border border-border-default shadow-sm">
            <h2 className="text-2xl font-bold text-text-heading">
              Send us a message
            </h2>

            <form className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-heading">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-border-default bg-bg-page outline-none focus:ring-2 focus:ring-action-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-border-default bg-bg-page outline-none focus:ring-2 focus:ring-action-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading">
                  Message
                </label>
                <textarea
                  rows="5"
                  required
                  placeholder="How can we help?"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-border-default bg-bg-page outline-none focus:ring-2 focus:ring-action-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-action-primary hover:bg-action-primary-hover text-text-inverse py-3 rounded-xl font-semibold transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
      {/* ================= MAP SECTION ================= */}
      <section className="bg-bg-section-soft border-t border-border-default">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-text-heading text-center">
            Visit Our Office
          </h2>

          <p className="mt-4 text-text-muted text-center max-w-2xl mx-auto">
            You can find us in Mumbai. Drop by or reach out anytime 🌱
          </p>

          <div className="mt-16 overflow-hidden rounded-2xl border border-border-default shadow-sm">
            <iframe
              title="Farmizo Office Location"
              src="https://www.google.com/maps?q=Mumbai&output=embed"
              className="w-full h-[400px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
