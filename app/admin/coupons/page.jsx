"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createCoupon,
  deleteCoupon,
  getAdminCoupons,
  updateCoupon,
} from "@/services/coupon.service";

const INITIAL_FORM = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minCartValue: "",
  maxDiscount: "",
  usageLimit: "",
  expiresAt: "",
  isActive: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState("");

  const isEditing = useMemo(() => !!editingId, [editingId]);

  const loadCoupons = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminCoupons();
      setCoupons(data);
    } catch (err) {
      setError(err.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId("");
  };

  const normalizePayload = () => ({
    code: form.code,
    discountType: form.discountType,
    discountValue: Number(form.discountValue) || 0,
    minCartValue: Number(form.minCartValue) || 0,
    maxDiscount: Number(form.maxDiscount) || 0,
    usageLimit: Number(form.usageLimit) || 0,
    expiresAt: form.expiresAt,
    isActive: Boolean(form.isActive),
  });

  const validateForm = () => {
    if (!String(form.code || "").trim()) {
      return "Coupon code is required";
    }

    if ((Number(form.discountValue) || 0) <= 0) {
      return "Discount value must be greater than 0";
    }

    if (
      form.discountType === "percentage" &&
      (Number(form.discountValue) || 0) > 100
    ) {
      return "Percentage discount cannot be more than 100";
    }

    if (!form.expiresAt) {
      return "Expiry date is required";
    }

    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      const payload = normalizePayload();
      if (isEditing) {
        await updateCoupon(editingId, payload);
        setSuccess("Coupon updated");
      } else {
        await createCoupon(payload);
        setSuccess("Coupon created");
      }

      resetForm();
      await loadCoupons();
    } catch (err) {
      setError(err.message || "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (coupon) => {
    setEditingId(coupon._id);
    setForm({
      code: coupon.code || "",
      discountType: coupon.discountType || "percentage",
      discountValue: String(coupon.discountValue ?? ""),
      minCartValue: String(coupon.minCartValue ?? ""),
      maxDiscount: String(coupon.maxDiscount ?? ""),
      usageLimit: String(coupon.usageLimit ?? ""),
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 10) : "",
      isActive: Boolean(coupon.isActive),
    });
    setSuccess("");
    setError("");
  };

  const onToggleActive = async (coupon) => {
    try {
      await updateCoupon(coupon._id, { isActive: !coupon.isActive });
      await loadCoupons();
    } catch (err) {
      setError(err.message || "Failed to update coupon");
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteCoupon(id);
      await loadCoupons();
      setSuccess("Coupon deleted");
    } catch (err) {
      setError(err.message || "Failed to delete coupon");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Coupons</h1>

      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow mb-8 grid md:grid-cols-2 gap-4">
        <input
          value={form.code}
          onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
          className="border p-2 rounded"
          placeholder="Coupon code"
          required
        />

        <select
          value={form.discountType}
          onChange={(e) => setForm((prev) => ({ ...prev, discountType: e.target.value }))}
          className="border p-2 rounded"
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>

        <input
          type="number"
          min="0"
          value={form.discountValue}
          onChange={(e) => setForm((prev) => ({ ...prev, discountValue: e.target.value }))}
          className="border p-2 rounded"
          placeholder="Discount value"
          required
        />

        <input
          type="number"
          min="0"
          value={form.minCartValue}
          onChange={(e) => setForm((prev) => ({ ...prev, minCartValue: e.target.value }))}
          className="border p-2 rounded"
          placeholder="Minimum cart value"
        />

        <input
          type="number"
          min="0"
          value={form.maxDiscount}
          onChange={(e) => setForm((prev) => ({ ...prev, maxDiscount: e.target.value }))}
          className="border p-2 rounded"
          placeholder="Maximum discount"
        />

        <input
          type="number"
          min="0"
          value={form.usageLimit}
          onChange={(e) => setForm((prev) => ({ ...prev, usageLimit: e.target.value }))}
          className="border p-2 rounded"
          placeholder="Usage limit (0 = unlimited)"
        />

        <input
          type="date"
          value={form.expiresAt}
          onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
          className="border p-2 rounded"
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
          />
          Active
        </label>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {saving ? "Saving..." : isEditing ? "Update Coupon" : "Create Coupon"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2 rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {error && <p className="mb-4 text-red-600">{error}</p>}
      {success && <p className="mb-4 text-green-700">{success}</p>}

      {loading ? (
        <p>Loading coupons...</p>
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="bg-white p-4 rounded shadow flex flex-wrap items-center gap-4 justify-between">
              <div>
                <p className="font-semibold">{coupon.code}</p>
                <p className="text-sm text-gray-600">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : `Rs. ${coupon.discountValue}`}{" "}
                  | Min: Rs. {coupon.minCartValue || 0} | Used: {coupon.usedCount}/
                  {coupon.usageLimit || "unlimited"}
                </p>
                <p className="text-xs text-gray-500">
                  Expires: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "-"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(coupon)}
                  className="border px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onToggleActive(coupon)}
                  className="border px-3 py-1 rounded"
                >
                  {coupon.isActive ? "Disable" : "Enable"}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(coupon._id)}
                  className="border border-red-300 text-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
