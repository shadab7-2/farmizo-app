"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  Heart,
} from "lucide-react";
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
  const wishlistCount = useSelector(
    (state) => state.wishlist?.wishlistItems?.length || 0,
  );

  const navLinks = [
    { name: "Products", href: "/products" },
    { name: "Plants", href: "/categories/plants" },
    { name: "Agri Products", href: "/categories/agriproducts" },
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
    <header className="sticky top-0 z-50 bg-bg-page border-b border-border-default">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-action-primary">
          Farmizo 🌱
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition ${
                  isActive
                    ? "text-action-primary"
                    : "text-text-body hover:text-action-primary"
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
          className="hidden md:flex items-center border border-border-default rounded-full px-3 py-1.5 w-64 bg-bg-page"
        >
          <input
            name="q"
            placeholder="Search plants, seeds..."
            className="ml-2 bg-transparent outline-none text-sm w-full"
          />
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Account Menu */}
          <div className="relative hidden md:block" ref={accountRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-border-default px-3 py-1.5 text-sm text-text-body hover:bg-bg-section-muted transition"
            >
              <User size={16} />
              <span>{isAuthenticated ? "Account" : "Sign in"}</span>
              <ChevronDown size={14} className={accountOpen ? "rotate-180 transition" : "transition"} />
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border-default bg-bg-page shadow-lg overflow-hidden">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2 text-sm text-text-body hover:bg-bg-section-muted"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2 text-sm text-text-body hover:bg-bg-section-muted"
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2 text-sm text-text-body hover:bg-bg-section-muted"
                    >
                      My Wishlist
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2 text-sm text-text-body hover:bg-bg-section-muted"
                    >
                      My Cart
                    </Link>
                    <Link
                      href="/logout"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2 text-sm text-status-error hover:bg-bg-section-muted"
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2 text-sm text-text-body hover:bg-bg-section-muted"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setAccountOpen(false)}
                      className="block px-4 py-2 text-sm text-text-body hover:bg-bg-section-muted"
                    >
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
          >
            <Heart size={22} />

            {wishlistCount > 0 && (
              <span
                className="
        absolute -top-2 -right-3
        bg-red-500 text-white
        text-[11px] font-bold
        min-w-[18px] h-[18px]
        flex items-center justify-center
        rounded-full px-1
      "
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center text-text-body hover:text-action-primary transition"
          >
            <ShoppingCart size={22} />

            {totalQty > 0 && (
              <span
                className="
        absolute -top-2 -right-3
        bg-action-primary text-white
        text-[11px] font-bold
        min-w-[18px] h-[18px]
        flex items-center justify-center
        rounded-full px-1
      "
              >
                {totalQty}
              </span>
            )}
          </Link>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-text-body hover:text-action-primary transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-default bg-bg-page px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block font-medium text-text-body hover:text-action-primary transition"
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Search */}
          <form
            action="/search"
            method="GET"
            className="flex items-center border border-border-default rounded-full px-3 py-2 bg-bg-page"
          >
            <Search size={16} className="text-text-muted" />
            <input
              name="q"
              placeholder="Search plants..."
              className="ml-2 outline-none w-full bg-transparent text-text-heading placeholder:text-text-muted"
            />
          </form>

          {/* Auth */}
          <div className="border-t border-border-default pt-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="block text-text-body hover:text-action-primary"
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="block text-text-body hover:text-action-primary"
                >
                  My Orders
                </Link>
                <Link
                  href="/wishlist"
                  className="block text-text-body hover:text-action-primary"
                >
                  My Wishlist
                </Link>
                <Link
                  href="/cart"
                  className="block text-text-body hover:text-action-primary"
                >
                  My Cart
                </Link>
                <Link
                  href="/logout"
                  className="block text-text-body hover:text-action-primary"
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-text-body hover:text-action-primary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block text-text-body hover:text-action-primary"
                >
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
