"use client";

export default function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onMakeDefault,
}) {
  return (
    <label
      className={`block rounded-2xl border p-4 shadow-sm cursor-pointer transition ${
        selected
          ? "border-action-primary bg-bg-section-soft"
          : "border-border-default hover:border-action-primary/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          name="savedAddress"
          className="mt-1"
          checked={selected}
          onChange={onSelect}
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-text-heading">{address.fullName || "Saved Address"}</p>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              {address.label || "Home"}
            </span>
            {address.isDefault && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                Default
              </span>
            )}
          </div>
          <p className="text-sm text-text-heading">{address.fullName}</p>
          <p className="text-sm text-text-muted">{address.phone}</p>
          <p className="text-sm text-text-muted">
            {address.street}, {address.city}, {address.state} {address.pincode}, {address.country}
          </p>

          <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold">
            {!address.isDefault && (
              <button type="button" onClick={(e) => { e.stopPropagation(); onMakeDefault?.(); }} className="text-action-primary hover:underline">
                Set as Default
              </button>
            )}
            <button type="button" onClick={(e) => { e.stopPropagation(); onEdit?.(); }} className="text-text-heading hover:underline">
              Edit
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); onDelete?.(); }} className="text-red-600 hover:underline">
              Delete
            </button>
          </div>
        </div>
      </div>
    </label>
  );
}
