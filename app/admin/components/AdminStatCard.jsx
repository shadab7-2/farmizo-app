"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

const formatTrend = (value = 0) => {
  const num = Number(value) || 0;
  const absValue = Math.abs(num).toFixed(1);
  return `${absValue}%`;
};

export default function AdminStatCard({
  title,
  value,
  trend = 0,
  icon: Icon,
  iconBgClass = "bg-emerald-100",
  iconClass = "text-emerald-700",
  growthLabel = "vs previous period",
  gradientClass = "from-emerald-50 to-white",
}) {
  const isPositive = Number(trend) >= 0;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border-default bg-gradient-to-br ${gradientClass} p-5 shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-text-muted">{title}</p>
          <p className="mt-2 text-2xl font-bold text-text-heading">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${iconBgClass}`}>
          <Icon size={20} className={iconClass} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        {isPositive ? (
          <TrendingUp size={14} className="text-green-600" />
        ) : (
          <TrendingDown size={14} className="text-red-600" />
        )}
        <span className={isPositive ? "text-green-700" : "text-red-700"}>
          {isPositive ? "+" : "-"}
          {formatTrend(trend)} {growthLabel}
        </span>
      </div>
    </div>
  );
}
