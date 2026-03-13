"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  addAddress,
  changePassword,
  deleteAddress,
  fetchProfile,
  updateAddress,
  updateProfile,
} from "@/store/slices/userProfileSlice";

const emptyAddress = {
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
  isDefault: false,
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { profile, addresses, loading, updating } = useSelector((state) => state.userProfile);

  const [personalForm, setPersonalForm] = useState({ name: "", phone: "" });
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (profile) {
      setPersonalForm({
        name: profile.name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const joinedDate = useMemo(() => {
    if (!profile?.createdAt) return null;
    return new Intl.DateTimeFormat("en", {
      dateStyle: "long",
    }).format(new Date(profile.createdAt));
  }, [profile]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(personalForm)).unwrap();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode || !addressForm.country) {
      toast.error("Please fill all address fields");
      return;
    }
    try {
      if (editingAddressId) {
        await dispatch(updateAddress({ id: editingAddressId, data: addressForm })).unwrap();
        toast.success("Address updated");
      } else {
        await dispatch(addAddress(addressForm)).unwrap();
        toast.success("Address added");
      }
      setAddressForm(emptyAddress);
      setEditingAddressId(null);
    } catch (err) {
      toast.error(err || "Address action failed");
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(String(addr._id));
    setAddressForm({
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      country: addr.country || "",
      isDefault: addr.isDefault || false,
    });
  };

  const handleDeleteAddress = async (id) => {
    try {
      await dispatch(deleteAddress(id)).unwrap();
      toast.success("Address removed");
      if (editingAddressId === id) {
        setEditingAddressId(null);
        setAddressForm(emptyAddress);
      }
    } catch (err) {
      toast.error(err || "Failed to delete address");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await dispatch(updateAddress({ id, data: { isDefault: true } })).unwrap();
      toast.success("Default address updated");
    } catch (err) {
      toast.error(err || "Failed to set default");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordForm;
    if (!oldPassword || !newPassword) {
      toast.error("Fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await dispatch(changePassword({ oldPassword, newPassword })).unwrap();
      toast.success("Password changed");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err || "Failed to change password");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="bg-bg-page">
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-text-heading">Profile</h1>
          <p className="mt-2 text-text-muted">Please login to view your profile.</p>
          <button
            onClick={() => router.push("/login?redirect=/profile")}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-action-primary px-6 py-3 text-sm font-semibold text-text-inverse shadow-sm hover:bg-action-primary-hover transition"
          >
            Go to Login
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-bg-page">
      <section className="mx-auto max-w-6xl px-6 py-16 space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-text-muted">Dashboard</p>
            <h1 className="text-3xl font-bold text-text-heading">Profile</h1>
            <p className="mt-2 text-sm text-text-muted">
              Manage your personal info, addresses, and security settings.
            </p>
          </div>
          {joinedDate && (
            <div className="rounded-2xl bg-surface-card px-4 py-3 shadow-sm border border-border-default">
              <p className="text-[12px] uppercase tracking-[0.15em] text-text-muted">Member since</p>
              <p className="text-sm font-semibold text-text-heading">{joinedDate}</p>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Personal Info */}
            <section className="rounded-2xl border border-border-default bg-surface-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Personal Information</p>
                  <h2 className="text-lg font-semibold text-text-heading">Basic details</h2>
                </div>
                {loading && <span className="text-xs text-text-muted">Loading...</span>}
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4 px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-muted">Full name</label>
                    <input
                      value={personalForm.name}
                      onChange={(e) => setPersonalForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-border-default bg-bg-page px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">Phone</label>
                    <input
                      value={personalForm.phone}
                      onChange={(e) => setPersonalForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-border-default bg-bg-page px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">Email</label>
                    <input
                      value={profile?.email || ""}
                      disabled
                      className="mt-2 w-full rounded-xl border border-border-default bg-gray-100 px-3 py-2 text-sm text-text-muted"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-muted">Status</label>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-bg-section-soft px-3 py-2 text-xs font-semibold text-action-primary">
                      Active account
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex items-center justify-center rounded-xl bg-action-primary px-4 py-2 text-sm font-semibold text-text-inverse shadow-sm transition hover:bg-action-primary-hover disabled:opacity-60"
                  >
                    {updating ? "Saving..." : "Save changes"}
                  </button>
                  <p className="text-xs text-text-muted">Your contact info is used for orders and notifications.</p>
                </div>
              </form>
            </section>

            {/* Address Book */}
            <section className="rounded-2xl border border-border-default bg-surface-card shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default px-6 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Address Book</p>
                  <h2 className="text-lg font-semibold text-text-heading">Shipping addresses</h2>
                </div>
                <span className="text-xs text-text-muted">{addresses.length} saved</span>
              </div>

              <div className="divide-y divide-border-default">
                {addresses.length === 0 && (
                  <p className="px-6 py-5 text-sm text-text-muted">No addresses yet. Add your first address below.</p>
                )}
                {addresses.map((addr) => (
                  <div key={addr._id} className="px-6 py-4 flex flex-wrap gap-3 items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-text-heading">{addr.street}</p>
                        {addr.isDefault && (
                          <span className="rounded-full bg-bg-section-soft px-2 py-1 text-[11px] font-semibold text-action-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-muted">
                        {addr.city}, {addr.state} {addr.pincode}
                      </p>
                      <p className="text-sm text-text-muted">{addr.country}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr._id)}
                          className="rounded-lg border border-border-default px-3 py-2 text-text-body hover:border-action-primary hover:text-action-primary"
                        >
                          Set default
                        </button>
                      )}
                      <button
                        onClick={() => handleEditAddress(addr)}
                        className="rounded-lg border border-border-default px-3 py-2 text-text-body hover:border-action-primary hover:text-action-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border-default px-6 py-5 bg-bg-section-muted">
                <p className="text-sm font-semibold text-text-heading mb-3">
                  {editingAddressId ? "Edit address" : "Add a new address"}
                </p>
                <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="rounded-xl border border-border-default bg-surface-card px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                    placeholder="Street & house number"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, street: e.target.value }))}
                  />
                  <input
                    className="rounded-xl border border-border-default bg-surface-card px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                  />
                  <input
                    className="rounded-xl border border-border-default bg-surface-card px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                    placeholder="State"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, state: e.target.value }))}
                  />
                  <input
                    className="rounded-xl border border-border-default bg-surface-card px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                    placeholder="Pincode"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, pincode: e.target.value }))}
                  />
                  <input
                    className="rounded-xl border border-border-default bg-surface-card px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                    placeholder="Country"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, country: e.target.value }))}
                  />
                  <label className="flex items-center gap-2 text-sm text-text-body">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                      className="h-4 w-4 rounded border-border-default text-action-primary focus:ring-action-primary"
                    />
                    Set as default address
                  </label>
                  <div className="md:col-span-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="rounded-xl bg-action-primary px-4 py-2 text-sm font-semibold text-text-inverse shadow-sm hover:bg-action-primary-hover transition"
                    >
                      {editingAddressId ? "Update address" : "Add address"}
                    </button>
                    {editingAddressId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddressId(null);
                          setAddressForm(emptyAddress);
                        }}
                        className="text-sm text-text-muted hover:text-text-body"
                      >
                        Cancel edit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Change Password */}
            <section className="rounded-2xl border border-border-default bg-surface-card shadow-sm">
              <div className="border-b border-border-default px-6 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Security</p>
                <h2 className="text-lg font-semibold text-text-heading">Change password</h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 px-6 py-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Current password</label>
                  <input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, oldPassword: e.target.value }))
                    }
                    className="w-full rounded-xl border border-border-default bg-bg-page px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">New password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    className="w-full rounded-xl border border-border-default bg-bg-page px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-muted">Confirm new password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    className="w-full rounded-xl border border-border-default bg-bg-page px-3 py-2 text-sm focus:border-action-primary focus:ring-2 focus:ring-action-primary/20"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-surface-sidebar px-4 py-2 text-sm font-semibold text-text-inverse shadow-sm transition hover:bg-action-primary"
                >
                  Update password
                </button>
                <p className="text-xs text-text-muted">
                  Use a strong password with at least 8 characters, including numbers and symbols.
                </p>
              </form>
            </section>

            {/* Account Settings */}
            <section className="rounded-2xl border border-border-default bg-surface-card shadow-sm">
              <div className="border-b border-border-default px-6 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Account Settings</p>
                <h2 className="text-lg font-semibold text-text-heading">Notifications & preferences</h2>
              </div>
              <div className="space-y-4 px-6 py-5 text-sm text-text-body">
                <SettingToggle label="Order updates" description="Get alerts for order status changes." defaultChecked />
                <SettingToggle label="Promotions" description="Receive curated deals and seasonal offers." />
                <SettingToggle label="Product recommendations" description="Personalized picks based on your purchases." />
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function SettingToggle({ label, description, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label className="flex items-start gap-3 rounded-xl border border-border-default bg-bg-section-muted px-4 py-3 hover:border-action-primary/60 transition cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-border-default text-action-primary focus:ring-action-primary"
      />
      <div>
        <p className="font-semibold text-text-heading">{label}</p>
        <p className="text-xs text-text-muted">{description}</p>
      </div>
    </label>
  );
}
