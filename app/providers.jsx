"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { useEffect, useMemo, useRef, isValidElement } from "react";
import { loadUser } from "@/store/slices/authSlice";
import {loadCart} from "@/store/slices/cartSlice";
import { fetchWishlist } from "@/store/slices/wishlistSlice";
import { Toaster } from "react-hot-toast";

/* ---------------------------------------------
   Runs once when app loads
   Restores auth + cart session
--------------------------------------------- */

function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const initialized = useRef(false); // 🚀 prevents double execution

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initApp = async () => {
      try {
        // 1️⃣ Try auto login
        const userResult = await dispatch(loadUser());

        // 2️⃣ If logged in → fetch cart
        if (loadUser.fulfilled.match(userResult) && userResult.payload) {
          await dispatch(loadCart());
          await dispatch(fetchWishlist());
        }

      } catch (err) {
        console.log("App init failed:", err);
      }
    };

    initApp();
  }, [dispatch]);

  return children;
}

export default function Providers({ children }) {
  // Guard against accidentally rendering raw Error objects (React cannot render plain objects)
  const safeChildren = useMemo(() => {
    if (
      children == null ||
      typeof children === "string" ||
      typeof children === "number" ||
      Array.isArray(children) ||
      isValidElement(children)
    ) {
      return children;
    }

    if (typeof children === "object" && "message" in children) {
      console.error("Unexpected non-renderable child passed to <Providers>:", children);
      return <div className="text-center text-red-600 py-8">Something went wrong: {children.message}</div>;
    }

    return String(children);
  }, [children]);

  return (
    <Provider store={store}>
      <Toaster position="top-center"/>
      <AppInitializer>{safeChildren}</AppInitializer>
    </Provider>
  );
}
