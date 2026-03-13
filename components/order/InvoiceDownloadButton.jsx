"use client";

import { useState } from "react";
import { FileDown, Loader2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { downloadInvoice, previewInvoice } from "@/services/order.service";

const baseButtonClasses =
  "inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition hover:-translate-y-[1px] hover:border-green-300 hover:shadow-sm disabled:translate-y-0 disabled:opacity-60";

const variantClasses = {
  solid: "bg-white hover:bg-green-50",
  ghost: "border-gray-300 bg-transparent hover:bg-gray-50",
};

export default function InvoiceDownloadButton({
  orderId,
  mode = "download", // "download" | "preview"
  label,
  className = "",
}) {
  const [loading, setLoading] = useState(false);
  const isPreview = mode === "preview";
  const buttonLabel = label || (isPreview ? "Preview Invoice" : "Download Invoice");

  const handleAction = async () => {
    if (!orderId) {
      toast.error("Order ID missing");
      return;
    }

    try {
      setLoading(true);
      if (isPreview) {
        await previewInvoice(orderId);
      } else {
        await downloadInvoice(orderId);
        toast.success("Invoice downloaded");
      }
    } catch (err) {
      toast.error(err.message || "Unable to fetch invoice");
    } finally {
      setLoading(false);
    }
  };

  const Icon = loading ? Loader2 : isPreview ? Eye : FileDown;

  return (
    <button
      type="button"
      onClick={handleAction}
      className={`${baseButtonClasses} ${variantClasses.solid} ${className}`}
      disabled={loading}
    >
      <Icon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      <span>{buttonLabel}</span>
    </button>
  );
}
