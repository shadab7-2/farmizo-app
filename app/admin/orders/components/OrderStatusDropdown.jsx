import { ORDER_STATUS_OPTIONS } from "./orderUtils";

export default function OrderStatusDropdown({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="h-9 rounded-md border border-gray-200 bg-white px-2 text-xs outline-none transition focus:border-green-500 disabled:opacity-60"
    >
      {ORDER_STATUS_OPTIONS.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
