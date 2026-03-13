import { Search } from "lucide-react";

export default function OrderFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  dateFilter,
  onDateFilterChange,
}) {
  return (
    <div className="flex flex-wrap gap-4 rounded-xl border border-border-default bg-surface-card p-4">
      <label className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search orders..."
          className="w-full rounded-lg border border-border-default py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </label>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-border-default px-4 py-2"
      >
        <option value="all">All Statuses</option>
        <option value="placed">Placed</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="out_for_delivery">Out for Delivery</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select
        value={dateFilter}
        onChange={(e) => onDateFilterChange(e.target.value)}
        className="rounded-lg border border-border-default px-4 py-2"
      >
        <option value="all">All Dates</option>
        <option value="today">Today</option>
        <option value="this_week">This Week</option>
        <option value="this_month">This Month</option>
      </select>
    </div>
  );
}
