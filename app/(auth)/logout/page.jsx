"use client";

import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { logoutUser } from "@/store/slices/authSlice";
import { clearCartAsync } from "@/store/slices/cartSlice";

export default function LogoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const redirect = searchParams.get("redirect") || "/login";

    const runLogout = async () => {
      try {
        await dispatch(logoutUser()).unwrap();
        await dispatch(clearCartAsync());
        toast.success("Logged out successfully");
      } catch {
        toast.error("Logout failed");
      } finally {
        router.replace(redirect);
      }
    };

    runLogout();
  }, [dispatch, router, searchParams]);

  return (
    <main className="min-h-[50vh] flex items-center justify-center">
      <p className="text-text-muted">Logging you out...</p>
    </main>
  );
}
