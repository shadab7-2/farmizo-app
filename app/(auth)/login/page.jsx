"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParam = useSearchParams();

  const redirect = searchParam.get("redirect") || "/";

  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(res)) {
      toast.success("Login successful");
      router.push(redirect);
    } else {
      toast.error(res.payload || "Login failed");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center">Welcome Back</h1>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-xl"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-xl"
        />

        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl">
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
      </form>

      <p className="mt-6 text-center text-sm">
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </p>
    </>
  );
}
