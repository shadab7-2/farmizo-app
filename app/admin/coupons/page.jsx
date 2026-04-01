"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createCoupon,
  deleteCoupon,
  getAdminCoupons,
  updateCoupon,
} from "@/services/coupon.service";
import styles from "./CouponPage.module.css";

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
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Promotions</p>
          <h1 className={styles.title}>Coupon Management</h1>
          <p className={styles.subtitle}>
            Create, monitor, and optimize discount codes with a premium control surface.
          </p>
        </div>
        <div className={styles.statusPill}>
          {coupons.length} coupons | {loading ? "Syncing..." : "Live"}
        </div>
      </header>

      {error && <div className={styles.errorBanner}>{error}</div>}
      {success && <div className={styles.successBanner}>{success}</div>}

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.kicker}>Create Coupon</p>
            <h2 className={styles.sectionTitle}>
              {isEditing ? "Update existing coupon" : "Create a new coupon"}
            </h2>
          </div>
          {isEditing && (
            <button type="button" className={styles.secondaryButton} onClick={resetForm}>
              Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={onSubmit} className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Coupon Code</label>
            <input
              value={form.code}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
              }
              className={styles.input}
              placeholder="FARM20"
              required
            />
            <p className={styles.helper}>Use uppercase, no spaces.</p>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Discount Type</label>
            <select
              value={form.discountType}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, discountType: e.target.value }))
              }
              className={styles.input}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Discount Value</label>
            <input
              type="number"
              min="0"
              value={form.discountValue}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, discountValue: e.target.value }))
              }
              className={styles.input}
              placeholder="20"
              required
            />
            <p className={styles.helper}>
              If percentage, value is 0-100. If fixed, value is currency amount.
            </p>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Minimum Order Value (optional)</label>
            <input
              type="number"
              min="0"
              value={form.minCartValue}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, minCartValue: e.target.value }))
              }
              className={styles.input}
              placeholder="0"
            />
            <p className={styles.helper}>Set 0 for no minimum.</p>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Maximum Discount (optional)</label>
            <input
              type="number"
              min="0"
              value={form.maxDiscount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, maxDiscount: e.target.value }))
              }
              className={styles.input}
              placeholder="500"
            />
            <p className={styles.helper}>Applicable when discount type is percentage.</p>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Usage Limit</label>
            <input
              type="number"
              min="0"
              value={form.usageLimit}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, usageLimit: e.target.value }))
              }
              className={styles.input}
              placeholder="100"
            />
            <p className={styles.helper}>0 means unlimited uses.</p>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Expiry Date</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, expiresAt: e.target.value }))
              }
              className={styles.input}
              required
            />
            <p className={styles.helper}>Coupons expire at midnight of selected date.</p>
          </div>

          <div className={styles.switchRow}>
            <div className={styles.switchLabel}>
              <p className={styles.label}>Active</p>
              <p className={styles.helper}>Toggle availability immediately.</p>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
              />
              <span className={styles.slider} />
            </label>
          </div>

          <div className={styles.actions}>
            <button type="submit" disabled={saving} className={styles.primaryButton}>
              {saving ? "Saving..." : isEditing ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.kicker}>Coupon List</p>
            <h2 className={styles.sectionTitle}>Manage & track performance</h2>
          </div>
          <div className={styles.badgeMuted}>{loading ? "Fetching..." : "All synced"}</div>
        </div>

        {loading ? (
          <div className={styles.skeletonGrid}>
            {[1, 2, 3].map((item) => (
              <div key={item} className={styles.skeletonCard}>
                <div className={styles.skeletonLeft} />
                <div className={styles.skeletonMid}>
                  <div className={styles.skeletonLineWide} />
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonBadgeRow}>
                    <div className={styles.skeletonBadge} />
                    <div className={styles.skeletonBadge} />
                  </div>
                </div>
                <div className={styles.skeletonActions}>
                  <div className={styles.skeletonCircle} />
                  <div className={styles.skeletonCircle} />
                  <div className={styles.skeletonCircle} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.listGrid}>
            {coupons.map((coupon) => {
              const isExpired =
                coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
              const status = isExpired
                ? "Expired"
                : coupon.isActive
                ? "Active"
                : "Disabled";
              return (
                <article key={coupon._id} className={styles.couponCard}>
                  <div className={styles.couponLeft}>
                    <div className={styles.codeBadge}>{coupon.code}</div>
                    <div className={styles.discount}>
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}% OFF`
                        : `₹${coupon.discountValue} OFF`}
                    </div>
                  </div>

                  <div className={styles.couponMeta}>
                    <p className={styles.metaRow}>
                      <span className={styles.metaLabel}>Expires</span>
                      <span className={styles.metaValue}>
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString()
                          : "-"}
                      </span>
                    </p>
                    <p className={styles.metaRow}>
                      <span className={styles.metaLabel}>Usage</span>
                      <span className={styles.metaValue}>
                        {coupon.usedCount}/{coupon.usageLimit || "unlimited"} used
                      </span>
                    </p>
                    <p className={styles.metaRow}>
                      <span className={styles.metaLabel}>Min order</span>
                      <span className={styles.metaValue}>
                        ₹{coupon.minCartValue || 0}
                      </span>
                    </p>
                  </div>

                  <div className={styles.couponRight}>
                    <span
                      className={
                        status === "Active"
                          ? styles.statusActive
                          : status === "Expired"
                          ? styles.statusExpired
                          : styles.statusDisabled
                      }
                    >
                      {status}
                    </span>

                    <div className={styles.actionsRow}>
                      <button
                        type="button"
                        onClick={() => onEdit(coupon)}
                        className={styles.iconButton}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleActive(coupon)}
                        className={styles.iconButton}
                        title={coupon.isActive ? "Disable" : "Enable"}
                      >
                        ⚡
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(coupon._id)}
                        className={`${styles.iconButton} ${styles.danger}`}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            {!coupons.length && (
              <div className={styles.emptyState}>No coupons created yet 🎟️</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
