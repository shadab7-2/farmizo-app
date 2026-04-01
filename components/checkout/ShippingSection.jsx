"use client";

import AddressSelector from "@/components/address/AddressSelector";
import AddressForm from "@/components/address/AddressForm";

const baseFields = [
  {
    label: "Full Name",
    name: "fullName",
    type: "text",
    placeholder: "John Doe",
  },
  {
    label: "Phone Number",
    name: "phone",
    type: "tel",
    placeholder: "10-digit mobile number",
  },
  {
    label: "Pincode",
    name: "pincode",
    type: "text",
    placeholder: "6-digit code",
  },
  {
    label: "Country",
    name: "country",
    type: "text",
    placeholder: "India",
  },
];

export default function ShippingSection({
  addresses,
  selectedAddressId,
  useNewAddress,
  editingAddressId,
  form,
  touched,
  formErrors,
  saveAddress,
  locationStatus,
  pincodeStatus,
  pincodeError,
  orderNotes,
  onOrderNotesChange,
  onChange,
  onBlur,
  onSubmit,
  showAddressForm,
  onAddNewClick,
  onSelectAddress,
  onAddNewAddress,
  onEditAddress,
  onDeleteAddress,
  onMakeDefaultAddress,
  onSaveAddress,
  onCancelAddressForm,
  addressFormInitialData,
}) {
  return (
    <div className="bg-surface-card p-6 lg:p-8 rounded-2xl border border-border-default shadow-sm">
      <h2 className="text-xl font-bold text-text-heading mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-action-primary/10 text-action-primary flex items-center justify-center text-sm">
          1
        </span>
        Shipping Details
      </h2>

      <form
        id="checkout-form"
        onSubmit={onSubmit}
        className="grid sm:grid-cols-2 gap-x-6 gap-y-5"
      >
        <div className="sm:col-span-2">
          <AddressSelector
            addresses={addresses}
            selectedId={selectedAddressId}
            onSelect={onSelectAddress}
            onAddNew={onAddNewClick || onAddNewAddress}
            onMakeDefault={onMakeDefaultAddress}
            onEdit={onEditAddress}
            onDelete={onDeleteAddress}
          />
        </div>

        {showAddressForm && (
          <div className="sm:col-span-2 rounded-2xl border border-border-default bg-bg-section-muted p-4">
            <h3 className="text-sm font-semibold text-text-heading mb-3">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h3>
            <AddressForm
              initialData={addressFormInitialData}
              onSubmit={onSaveAddress}
              onCancel={onCancelAddressForm}
              asForm={false}
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-text-heading mb-1.5">
            Order Notes (optional)
          </label>
          <textarea
            name="orderNotes"
            value={orderNotes}
            onChange={(e) => onOrderNotesChange?.(e.target.value)}
            placeholder="Leave at door / Call before delivery"
            className="w-full px-4 py-3 rounded-lg border bg-bg-page focus:ring-2 focus:ring-action-primary/50 outline-none transition resize-none border-border-default"
            rows={3}
          />
        </div>

        {baseFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-text-heading mb-1.5">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              placeholder={field.placeholder}
              onChange={onChange}
              onBlur={onBlur}
              required={useNewAddress}
              className={`w-full px-4 py-2.5 rounded-lg border bg-bg-page focus:ring-2 focus:ring-action-primary/50 outline-none transition duration-200 ${
                useNewAddress && touched[field.name] && formErrors[field.name]
                  ? "border-status-error focus:border-status-error bg-status-error/10"
                  : "border-border-default hover:border-action-primary/50 focus:border-action-primary"
              }`}
            />
            {useNewAddress && touched[field.name] && formErrors[field.name] && (
              <p className="mt-1 text-xs text-status-error font-medium">
                {formErrors[field.name]}
              </p>
            )}
            {field.name === "pincode" && locationStatus.message && (
              <p
                className={`mt-1 text-xs font-semibold ${
                  locationStatus.success ? "text-status-success" : "text-status-error"
                }`}
              >
                {locationStatus.message}
              </p>
            )}
            {field.name === "pincode" && pincodeStatus.serviceable === true && (
              <p className="mt-1 text-xs font-semibold text-status-success">
                Delivery available in {pincodeStatus.deliveryDays || 3}-
                {(pincodeStatus.deliveryDays || 3) + 2} days
              </p>
            )}
            {field.name === "pincode" && pincodeStatus.serviceable === false && (
              <p className="mt-1 text-xs font-semibold text-status-error">
                Delivery not available
              </p>
            )}
            {field.name === "pincode" && pincodeError && (
              <p className="mt-1 text-xs text-status-error">{pincodeError}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-text-heading mb-1.5">
            City / Town
          </label>
          <input
            type="text"
            name="city"
            value={form.city}
            placeholder="e.g. Mumbai"
            onChange={onChange}
            onBlur={onBlur}
            required={useNewAddress}
            className={`w-full px-4 py-2.5 rounded-lg border bg-bg-page focus:ring-2 focus:ring-action-primary/50 outline-none transition duration-200 ${
              useNewAddress && touched.city && formErrors.city
                ? "border-status-error focus:border-status-error bg-status-error/10"
                : "border-border-default hover:border-action-primary/50 focus:border-action-primary"
            }`}
          />
          {useNewAddress && touched.city && formErrors.city && (
            <p className="mt-1 text-xs text-status-error font-medium">
              {formErrors.city}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-heading mb-1.5">
            State
          </label>
          <input
            type="text"
            name="state"
            value={form.state}
            placeholder="Maharashtra"
            onChange={onChange}
            onBlur={onBlur}
            required={useNewAddress}
            className={`w-full px-4 py-2.5 rounded-lg border bg-bg-page focus:ring-2 focus:ring-action-primary/50 outline-none transition duration-200 ${
              useNewAddress && touched.state && formErrors.state
                ? "border-status-error focus:border-status-error bg-status-error/10"
                : "border-border-default hover:border-action-primary/50 focus:border-action-primary"
            }`}
          />
          {useNewAddress && touched.state && formErrors.state && (
            <p className="mt-1 text-xs text-status-error font-medium">
              {formErrors.state}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-text-heading mb-1.5">
            Street Address
          </label>
          <textarea
            rows="3"
            name="street"
            value={form.street}
            placeholder="House No, Building, Street, Area"
            onChange={onChange}
            onBlur={onBlur}
            required={useNewAddress}
            className={`w-full px-4 py-3 rounded-lg border bg-bg-page focus:ring-2 focus:ring-action-primary/50 outline-none transition duration-200 resize-none ${
              useNewAddress && touched.street && formErrors.street
                ? "border-status-error focus:border-status-error bg-status-error/10"
                : "border-border-default hover:border-action-primary/50 focus:border-action-primary"
            }`}
          />
          {useNewAddress && touched.street && formErrors.street && (
            <p className="mt-1 text-xs text-status-error font-medium">
              {formErrors.street}
            </p>
          )}
        </div>

        {(useNewAddress || addresses.length === 0) && (
          <div className="sm:col-span-2 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="saveAddress"
                  checked={saveAddress}
                  onChange={onChange}
                  className="peer w-5 h-5 cursor-pointer appearance-none rounded border border-border-default bg-bg-page checked:bg-action-primary checked:border-action-primary hover:border-action-primary/50 transition duration-200"
                />
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-text-inverse"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm text-text-heading group-hover:text-action-primary transition select-none">
                Save this address for future orders
              </span>
            </label>
          </div>
        )}
      </form>
    </div>
  );
}
