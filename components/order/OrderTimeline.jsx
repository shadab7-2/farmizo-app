"use client";

import {
  CheckCircle,
  PackageCheck,
  Truck,
  MapPin,
  Home,
} from "lucide-react";

const STEP_CONFIG = {
  placed: {
    label: "Order Placed",
    icon: CheckCircle,
  },
  confirmed: {
    label: "Confirmed",
    icon: PackageCheck,
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
  },
  out_for_delivery: {
    label: "Out for delivery",
    icon: MapPin,
  },
  delivered: {
    label: "Delivered",
    icon: Home,
  },
};

export default function OrderTimeline({ timeline = [], currentStatus }) {
  const steps = Object.keys(STEP_CONFIG);

  const getState = (step) => {
    const currentIndex = steps.indexOf(currentStatus);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-6">
        {steps.map((step, index) => {
          const state = getState(step);
          const record = timeline.find((t) => t.status === step);
          const Icon = STEP_CONFIG[step].icon;
          console.log(record)
          return (
            <div key={step} className="flex gap-4 items-start">
              
              {/* LEFT ICON + LINE */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-full border-2 transition
                    ${
                      state === "completed"
                        ? "bg-green-500 border-green-500 text-white"
                        : state === "current"
                        ? "border-blue-500 text-blue-500 animate-pulse"
                        : "border-gray-300 text-gray-400"
                    }
                  `}
                >
                  <Icon size={18} />
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`w-[2px] h-10 ${
                      state === "completed"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>

              {/* RIGHT TEXT */}
              <div className="pt-1">
                <p
                  className={`font-semibold ${
                    state === "current"
                      ? "text-blue-600"
                      : state === "completed"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {STEP_CONFIG[step].label}
                </p>

                {record ? (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(record.date)}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">
                    Waiting...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}