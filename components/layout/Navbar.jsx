"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ShoppingCart, User, Search, ChevronDown, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import useCart from "@/hooks/useCart";
import { fetchWishlist } from "@/store/slices/wishlistSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const pathname = usePathname();
  const { totalQty } = useCart();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const wishlistCount = useSelector((state) => state.wishlist?.wishlistItems?.length || 0);

  const navLinks = [
    { name: "Products", href: "/products" },
    { name: "Plants", href: "/categories/plants" },
    { name: "Agri Products", href: "/categories/agriproducts" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <header className="sticky top-0 z-50 bg-surface-card/95 backdrop-blur border-b border-border-default shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-action-primary hover:text-action-primary-hover transition"
        >
          <span className="h-9 w-9 rounded-xl bg-bg-section-soft flex items-center justify-center text-action-primary text-xl">
            🌿
          </span>
          <span>Farmizo</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition hover:text-action-primary ${
                  isActive ? "text-action-primary" : "text-text-body"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <form
          action="/search"
          method="GET"
          className="hidden md:flex items-center gap-2 rounded-full border border-border-default bg-surface-card px-3 py-2 w-72 shadow-inner"
        >
          <Search size={16} className="text-text-muted" />
          <input
            name="q"
            placeholder="Search plants, seeds..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-text-muted"
          />
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          {/* Account Menu */}
          <div className="relative hidden md:block" ref={accountRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-border-default px-3 py-2 text-sm font-semibold text-text-body hover:text-action-primary hover:border-action-primary/40 transition"
            >
              <User size={16} />
              <span>{isAuthenticated ? "Account" : "Sign in"}</span>
              <ChevronDown size={14} className={`transition ${accountOpen ? "rotate-180" : ""}`} />
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border-default bg-surface-card shadow-lg overflow-hidden">
                {isAuthenticated ? (
                  <>
                    <Link href="/profile" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-text-body hover:bg-bg-section-muted">
                      Profile
                    </Link>
                    <Link href="/orders" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-text-body hover:bg-bg-section-muted">
                      Orders
                    </Link>
                    <Link href="/logout" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-status-error hover:bg-bg-section-muted">
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-text-body hover:bg-bg-section-muted">
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-text-body hover:bg-bg-section-muted">
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative flex items-center text-text-body hover:text-action-primary transition"
            aria-label="Wishlist"
          >
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-status-error text-text-inverse text-[11px] font-bold `min-w-[18px] h-[18px]` flex items-center justify-center rounded-full px-1">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center text-text-body hover:text-action-primary transition"
            aria-label="Cart"
          >
            <ShoppingCart size={22} />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-3 bg-action-primary text-text-inverse text-[11px] font-bold `min-w-[18px]` `h-[18px]` flex items-center justify-center rounded-full px-1">
                {totalQty}
              </span>
            )}
          </Link>

          {/* Mobile Search icon */}
          <Link href="/search" className="md:hidden text-text-body hover:text-action-primary transition">
            <Search size={20} />
          </Link>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-text-body hover:text-action-primary transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border-default bg-surface-card px-6 py-4 space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl border border-border-default px-3 py-2 text-sm font-semibold text-text-heading hover:border-action-primary/40 hover:text-action-primary transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Search */}
          <form
            action="/search"
            method="GET"
            className="flex items-center border border-border-default rounded-full px-3 py-2 bg-bg-page shadow-inner"
          >
            <Search size={16} className="text-text-muted" />
            <input
              name="q"
              placeholder="Search plants..."
              className="ml-2 outline-none w-full bg-transparent text-text-heading placeholder:text-text-muted"
            />
          </form>

          {/* Account quick links */}
          <div className="border-t border-border-default pt-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="block text-text-body hover:text-action-primary" onClick={() => setMobileOpen(false)}>
                  Profile
                </Link>
                <Link href="/orders" className="block text-text-body hover:text-action-primary" onClick={() => setMobileOpen(false)}>
                  Orders
                </Link>
                <Link href="/logout" className="block text-text-body hover:text-action-primary" onClick={() => setMobileOpen(false)}>
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-text-body hover:text-action-primary" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="block text-text-body hover:text-action-primary" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
