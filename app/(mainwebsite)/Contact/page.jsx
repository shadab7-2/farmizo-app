"use client";

import ContactHero from "@/components/contact/ContactHero";
import ContactInfoCards from "@/components/contact/ContactInfoCards";
import ContactForm from "@/components/contact/ContactForm";
import ContactFAQ from "@/components/contact/ContactFAQ";
import ContactTrust from "@/components/contact/ContactTrust";
import ContactCTA from "@/components/contact/ContactCTA";

export default function ContactPage() {
  return (
    <main className="bg-bg-page">
      <ContactHero />
      <ContactInfoCards />
      <ContactForm />

      {/* Map */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="rounded-2xl border border-border-default bg-white shadow-sm p-6 space-y-3 text-center">
          <h2 className="text-2xl font-bold text-text-heading">Visit Us</h2>
          <p className="text-text-muted">Drop by our Mumbai studio or schedule a virtual consult.</p>
          <div className="mt-4 overflow-hidden rounded-xl border border-border-default shadow-sm">
            <iframe
              title="Farmizo Office Location"
              src="https://www.google.com/maps?q=Mumbai&output=embed"
              className="w-full h-[380px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <ContactFAQ />
      <ContactTrust />
      <ContactCTA />
    </main>
  );
}
