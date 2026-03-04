"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/";

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(res)) {
      toast.success("User registered successfully");
      router.push(redirect);
    } else {
      toast.error(res.payload || "Registration failed");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-text-heading text-center">
        Create Account
      </h1>

      <p className="mt-2 text-text-muted text-center">
        Join Farmizo and start growing today.
      </p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-text-heading">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-border-default bg-bg-page outline-none focus:ring-2 focus:ring-action-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-heading">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-border-default bg-bg-page outline-none focus:ring-2 focus:ring-action-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-heading">
            Password
          </label>

          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-border-default bg-bg-page outline-none focus:ring-2 focus:ring-action-primary"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-action-primary hover:bg-action-primary-hover text-text-inverse py-3 rounded-xl font-semibold transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-action-primary font-medium hover:underline">
          Login
        </Link>
      </p>
    </>
  );
}
