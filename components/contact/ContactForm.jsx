"use client";

import Image from "@/components/common/SafeImage";

export default function ContactForm() {
  return (
    <section id="contact-form" className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
      <div className="relative">
        <div className="absolute -left-6 -top-6 h-16 w-16 rounded-full bg-brand-secondary/25 blur-3xl opacity-60" />
        <div className="absolute right-0 -bottom-8 h-24 w-24 rounded-full bg-brand-accent/30 blur-3xl opacity-60" />
        <Image
          src="https://images.unsplash.com/photo-1652285952518-5c6affc36bda?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Plant care support"
          width={520}
          height={440}
          className="relative rounded-3xl shadow-xl object-cover w-full h-[420px]"
        />
      </div>

      <div className="rounded-2xl border border-border-default bg-surface-card p-8 shadow-md">
        <h2 className="text-2xl font-bold text-text-heading">Send us a message</h2>
        <p className="text-text-muted mt-2">
          Share your queries and our garden experts will get back within 24 hours.
        </p>
        <form className="mt-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-heading">Name</label>
              <input
                type="text"
                required
                placeholder="Your name"
                className="mt-2 w-full rounded-lg border border-border-default px-4 py-3 text-sm bg-bg-page focus:border-action-primary focus:ring-2 focus:ring-action-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-heading">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="mt-2 w-full rounded-lg border border-border-default px-4 py-3 text-sm bg-bg-page focus:border-action-primary focus:ring-2 focus:ring-action-primary/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-heading">Subject</label>
              <input
                type="text"
                required
                placeholder="How can we help?"
                className="mt-2 w-full rounded-lg border border-border-default px-4 py-3 text-sm bg-bg-page focus:border-action-primary focus:ring-2 focus:ring-action-primary/20 outline-none"
              />
            </div>

          <div>
            <label className="block text-sm font-semibold text-text-heading">Message</label>
            <textarea
              rows="5"
              required
              placeholder="Tell us more about your query"
              className="mt-2 w-full rounded-lg border border-border-default px-4 py-3 text-sm bg-bg-page focus:border-action-primary focus:ring-2 focus:ring-action-primary/20 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-action-primary px-5 py-3 text-text-inverse text-sm font-semibold shadow-lg shadow-action-primary/30 hover:bg-action-primary-hover transition duration-200"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
