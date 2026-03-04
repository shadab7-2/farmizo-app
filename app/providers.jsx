"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { useEffect, useRef } from "react";
import { loadUser } from "@/store/slices/authSlice";
import {loadCart} from "@/store/slices/cartSlice";
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
  return (
    <Provider store={store}>
      <Toaster position="top-center"/>
      <AppInitializer>{children}</AppInitializer>
    </Provider>
  );
}
