"use client";

import { useCallback, useState } from "react";
import { checkPincode } from "@/services/delivery.service";

export default function usePincodeCheck() {
  const [status, setStatus] = useState({ loading: false, serviceable: null, deliveryDays: null, codAvailable: null });
  const [error, setError] = useState("");

  const runCheck = useCallback(async (pincode) => {
    if (!pincode) return;
    setStatus((s) => ({ ...s, loading: true }));
    setError("");
    try {
      const res = await checkPincode(pincode);
      setStatus({
        loading: false,
        serviceable: !!res.serviceable,
        deliveryDays: res.deliveryDays ?? null,
        codAvailable: res.codAvailable ?? null,
      });
      return res;
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to check delivery");
      setStatus({ loading: false, serviceable: null, deliveryDays: null, codAvailable: null });
    }
  }, []);

  return { status, error, runCheck };
}
