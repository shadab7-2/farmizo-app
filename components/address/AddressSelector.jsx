"use client";

import AddressCard from "./AddressCard";

export default function AddressSelector({
  addresses = [],
  selectedId,
  onSelect,
  onAddNew,
  onEdit,
  onDelete,
  onMakeDefault,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-heading">Saved Addresses</h3>
        <button
          type="button"
          onClick={onAddNew}
          className="text-sm font-semibold text-action-primary hover:underline"
        >
          + Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <AddressCard
            key={addr._id}
            address={addr}
            selected={String(selectedId) === String(addr._id)}
            onSelect={() => onSelect(addr._id)}
            onEdit={() => onEdit?.(addr)}
            onDelete={() => onDelete?.(addr._id)}
            onMakeDefault={() => onMakeDefault?.(addr._id)}
          />
        ))}
      </div>

      {addresses.length === 0 && (
        <p className="text-sm text-text-muted">No saved addresses yet.</p>
      )}
    </div>
  );
}
