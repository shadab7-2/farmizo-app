"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const moneyFormatter = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

export default function AdminChart({ data = [] }) {
  return (
    <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-heading">Sales Analytics</h3>
        <p className="text-sm text-text-muted">Monthly revenue and order trend (last 12 months)</p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tickFormatter={moneyFormatter} tick={{ fontSize: 12 }} width={85} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} width={40} />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Revenue") return [moneyFormatter(value), name];
                return [value, name];
              }}
              labelClassName="text-text-heading"
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#16a34a" strokeWidth={2.5} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#2563eb" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
