"use client";

import { useEffect, useState, startTransition } from "react";

// Shallow compare helper to avoid redundant state updates
const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (a[key] !== b[key]) return false;
  }
  return true;
};

const LABEL_OPTIONS = ["Home", "Office", "Village", "Other"];

const emptyForm = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  label: "Home",
  customLabel: "",
  isDefault: false,
};

export default function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  asForm = true,
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    // Derive form state from incoming initialData without causing unnecessary sync re-renders
    if (initialData) {
      const safeLabel = LABEL_OPTIONS.includes(initialData.label)
        ? initialData.label
        : "Other";

      const nextForm = {
        ...emptyForm,
        ...initialData,
        label: safeLabel,
        customLabel:
          safeLabel === "Other" && initialData.label && !LABEL_OPTIONS.includes(initialData.label)
            ? initialData.label
            : "",
      };

      startTransition(() => setForm((prev) => (shallowEqual(prev, nextForm) ? prev : nextForm)));
    } else {
      startTransition(() => setForm((prev) => (shallowEqual(prev, emptyForm) ? prev : emptyForm)));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      // keep a default country to satisfy backend validation
      if (!next.country) next.country = "India";
      return next;
    });
  };

  const handleSubmit = (e) => {
    if (asForm) e.preventDefault();
    const label =
      form.label === "Other" && form.customLabel?.trim()
        ? form.customLabel.trim()
        : LABEL_OPTIONS.includes(form.label)
          ? form.label
          : "Home";

    const payload = Object.fromEntries(
      Object.entries({
        ...form,
        label,
      }).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v]),
    );

    if (!payload.country) payload.country = "India";
    delete payload.customLabel;

    onSubmit?.(payload);
  };

  const Container = asForm ? "form" : "div";

  return (
    <Container onSubmit={asForm ? handleSubmit : undefined} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { name: "fullName", label: "Full Name", placeholder: "John Doe" },
        { name: "phone", label: "Phone", placeholder: "10 digit number" },
        { name: "pincode", label: "Pincode", placeholder: "6 digit" },
        { name: "city", label: "City", placeholder: "Mumbai" },
        { name: "state", label: "State", placeholder: "Maharashtra" },
        { name: "country", label: "Country", placeholder: "India" },
      ].map((field) => (
        <div key={field.name}>
          <label className="text-sm font-semibold text-text-heading">{field.label}</label>
          <input
            name={field.name}
            value={form[field.name]}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-border-default bg-bg-page px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
            placeholder={field.placeholder}
            required
          />
        </div>
      ))}

      <div className="md:col-span-2 space-y-2">
        <p className="text-sm font-semibold text-text-heading">Label</p>
        <div className="flex flex-wrap gap-3">
          {LABEL_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="label"
                value={option}
                checked={form.label === option}
                onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {form.label === "Other" && (
          <div>
            <label className="text-sm text-text-heading">Custom Label</label>
            <input
              name="customLabel"
              value={form.customLabel}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-border-default bg-bg-page px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
              placeholder="e.g. Parents House"
            />
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="text-sm font-semibold text-text-heading">Street</label>
        <textarea
          name="street"
          rows="3"
          value={form.street}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-border-default bg-bg-page px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
          placeholder="House no, street, area"
          required
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-text-heading">
        <input
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
          className="h-4 w-4 rounded border-border-default text-action-primary focus:ring-action-primary"
        />
        Set as default
      </label>

      <div className="flex items-center gap-3 md:col-span-2">
        <button
          type={asForm ? "submit" : "button"}
          onClick={!asForm ? handleSubmit : undefined}
          disabled={loading}
          className="rounded-xl bg-action-primary px-4 py-2 text-sm font-semibold text-text-inverse disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-text-muted hover:text-text-heading"
          >
            Cancel
          </button>
        )}
      </div>
    </Container>
  );
}
