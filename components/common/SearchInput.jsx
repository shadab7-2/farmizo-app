import { Search, X } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  onClear,
}) {
  return (
    <div
      className={`relative flex items-center rounded-lg border border-border-default bg-surface-card px-3 py-2 shadow-sm ${className}`}
    >
      <Search size={16} className="text-text-muted" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange?.("");
            onClear?.();
          }}
          className="ml-2 rounded-full p-1 text-text-muted transition hover:bg-surface-hover"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
