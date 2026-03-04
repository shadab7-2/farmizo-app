"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ShieldCheck,
  Truck,
  Leaf,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bg-section-muted text-text-body">

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

        {/* BRAND */}
        <div>
          <h2 className="text-3xl font-bold text-text-heading">Farmizo</h2>
          <p className="italic mt-1 text-text-muted">
            Grow Green, Live Better
          </p>

          <p className="mt-4 text-sm leading-relaxed">
            Farmizo is a modern agri-commerce platform offering plants,
            seeds, fertilizers, pots, and gardening essentials for
            urban homes and farmers.
          </p>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap gap-4 mt-6 text-text-muted">
            <div className="flex items-center gap-1 text-sm">
              <ShieldCheck size={18} /> Secure Payments
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Truck size={18} /> Fast Delivery
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Leaf size={18} /> Eco Friendly
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-text-heading mb-5">
            Company
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/about" className="hover:text-action-primary">About Us</Link></li>
            <li><Link href="/products" className="hover:text-action-primary">Shop</Link></li>
            <li><Link href="/blog" className="hover:text-action-primary">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-action-primary">Careers</Link></li>
            <li><Link href="/contact" className="hover:text-action-primary">Contact</Link></li>
          </ul>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="text-lg font-semibold text-text-heading mb-5">
            Categories
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/categories/plants" className="hover:text-action-primary">Plants</Link></li>
            <li><Link href="/categories/seeds" className="hover:text-action-primary">Seeds</Link></li>
            <li><Link href="/categories/fertilizers" className="hover:text-action-primary">Fertilizers</Link></li>
            <li><Link href="/categories/pots" className="hover:text-action-primary">Pots & Planters</Link></li>
            <li><Link href="/categories/tools" className="hover:text-action-primary">Garden Tools</Link></li>
            <li><Link href="/categories/organic" className="hover:text-action-primary">Organic Products</Link></li>
          </ul>
        </div>

        {/* SUPPORT + NEWSLETTER */}
        <div>
          <h3 className="text-lg font-semibold text-text-heading mb-5">
            Support
          </h3>

          <address className="not-italic text-sm space-y-2">
            <p>📍 Mumbai, Maharashtra</p>
            <p>📞 +91 9XXXXXXXXX</p>
            <p>✉️ support@farmizo.com</p>
            <p>🕘 Mon–Sat: 9 AM – 7 PM</p>
          </address>

          {/* NEWSLETTER */}
          <div className="mt-6">
            <p className="text-sm font-medium mb-2 text-text-heading">
              Subscribe for offers & updates
            </p>

            <form
              className="flex"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscribed! (demo)");
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 rounded-l-md bg-bg-page text-text-heading outline-none border border-border-default"
              />
              <button
                type="submit"
                className="bg-action-primary hover:bg-action-primary-hover px-5 py-2 rounded-r-md text-text-inverse text-sm font-semibold transition"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* SOCIALS */}
          <div className="flex gap-4 mt-6 text-text-muted">
            <a href="#" aria-label="Instagram" className="hover:text-action-primary">
              <Instagram />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-action-primary">
              <Facebook />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-action-primary">
              <Linkedin />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-action-primary">
              <Youtube />
            </a>
          </div>
        </div>
      </div>

      {/* LEGAL BAR */}
      <div className="border-t border-border-default">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between text-xs text-text-muted gap-4">

          <p>
            © {new Date().getFullYear()} Farmizo. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-action-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-action-primary">
              Terms
            </Link>
            <Link href="/refund-policy" className="hover:text-action-primary">
              Refund Policy
            </Link>
            <Link href="/shipping-policy" className="hover:text-action-primary">
              Shipping Policy
            </Link>
            <Link href="/disclaimer" className="hover:text-action-primary">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
