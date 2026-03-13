import { Package, Clock3, CircleCheckBig, CircleX } from "lucide-react";

const cards = [
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: Package,
    wrapperClass: "bg-sky-50 border-sky-100",
    iconClass: "text-sky-700",
  },
  {
    key: "pendingOrders",
    label: "Pending Orders",
    icon: Clock3,
    wrapperClass: "bg-amber-50 border-amber-100",
    iconClass: "text-amber-700",
  },
  {
    key: "deliveredOrders",
    label: "Delivered Orders",
    icon: CircleCheckBig,
    wrapperClass: "bg-emerald-50 border-emerald-100",
    iconClass: "text-emerald-700",
  },
  {
    key: "cancelledOrders",
    label: "Cancelled Orders",
    icon: CircleX,
    wrapperClass: "bg-red-50 border-red-100",
    iconClass: "text-red-700",
  },
];

export default function OrderStats({ summary, loading }) {
  return (
    <>
      {/* OLD IMPLEMENTATION */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className={`rounded-xl border p-4 ${card.wrapperClass}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <div className="rounded-full bg-white/80 p-2">
                  <Icon className={`h-4 w-4 ${card.iconClass}`} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-gray-900">
                {loading ? "--" : Number(summary?.[card.key] || 0).toLocaleString("en-IN")}
              </p>
            </div>
          );
        })}
      </div>

      {/* NEW TAILWIND IMPLEMENTATION */}
      {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border-default bg-surface-card p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm text-text-muted">Total Orders</p>
          <h2 className="text-3xl font-bold text-text-heading">
            {loading ? "--" : Number(summary?.totalOrders || 0).toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-xl border border-border-default bg-surface-card p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm text-text-muted">Pending Orders</p>
          <h2 className="text-3xl font-bold text-yellow-600">
            {loading ? "--" : Number(summary?.pendingOrders || 0).toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-xl border border-border-default bg-surface-card p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm text-text-muted">Delivered Orders</p>
          <h2 className="text-3xl font-bold text-status-success">
            {loading ? "--" : Number(summary?.deliveredOrders || 0).toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-xl border border-border-default bg-surface-card p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm text-text-muted">Cancelled Orders</p>
          <h2 className="text-3xl font-bold text-status-error">
            {loading ? "--" : Number(summary?.cancelledOrders || 0).toLocaleString("en-IN")}
          </h2>
        </div>
      </div> */}
    </>
  );
}
