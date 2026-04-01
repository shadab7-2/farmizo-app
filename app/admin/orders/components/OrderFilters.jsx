import SearchInput from "@/components/common/SearchInput";

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
      <div className="min-w-[220px] flex-1">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search orders..."
        />
      </div>

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
