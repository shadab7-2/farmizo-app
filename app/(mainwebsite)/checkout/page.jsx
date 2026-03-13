"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/common/SafeImage";
import Script from "next/script";

import { clearCartAsync } from "@/store/slices/cartSlice";
import { createOrder } from "@/services/order.service";
import { applyCoupon } from "@/services/coupon.service";
import { loadUser } from "@/store/slices/authSlice";
import {
  addAddress as addAddressAction,
  fetchAddresses,
  setDefaultAddress as setDefaultAddressAction,
deleteAddress as deleteAddressAction,
  updateAddress as updateAddressAction,
} from "@/store/slices/addressSlice";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/services/payment.service";
import toast from "react-hot-toast";
import AddressSelector from "@/components/address/AddressSelector";
import AddressForm from "@/components/address/AddressForm";
import { usePincodeCheck } from "@/hooks/usePincodeCheck";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cartItems = useSelector((state) => state.cart.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const addresses = useSelector((state) => state.address.list);

const subtotal = useMemo(() => {
  return cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}, [cartItems]);
const deliveryDays = useMemo(() => 3 + Math.floor(Math.random() * 3), []);
const { status: pincodeStatus, error: pincodeError, runCheck } = usePincodeCheck();
const isPincodeBlocked = pincodeStatus.serviceable === false;
const [locationStatus, setLocationStatus] = useState({
  autoFilled: false,
  success: null,
  message: "",
});

  const shipping = subtotal > 500 ? 0 : 60;

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [saveAddress, setSaveAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [lastPaymentError, setLastPaymentError] = useState("");
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const discount = Math.min(appliedCoupon?.discount || 0, subtotal);
  const total = Math.max(subtotal - discount, 0) + shipping;

  const formatMoney = (value) => Number(value || 0).toFixed(2);

  // Fetch addresses when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, isAuthenticated]);

  // Auto-fill form with default address or first address; fallback to user info
  useEffect(() => {
    if (!user) return;
    const defaultAddress =
  addresses?.find((a) => a.isDefault) || addresses?.[0] || null;

    if (!useNewAddress) {
      if (defaultAddress && !selectedAddressId) {
        setSelectedAddressId(String(defaultAddress._id));
      } else if (!defaultAddress && !selectedAddressId) {
        setUseNewAddress(true);
      }
    }

    if (useNewAddress) {
      setForm((prev) => ({
        ...prev,
        email: user.email || prev.email || "",
      }));
      return;
    }

    const source =
      addresses.find((a) => String(a._id) === String(selectedAddressId)) ||
      defaultAddress ||
      {};

    setForm((prev) => ({
      ...prev,
      fullName: source.fullName || user.name || prev.fullName || "",
      email: user.email || prev.email || "",
      phone: source.phone || prev.phone || "",
      street: source.street || prev.street || "",
      city: source.city || prev.city || "",
      state: source.state || prev.state || "",
      pincode: source.pincode || prev.pincode || "",
      country: source.country || prev.country || "",
    }));
  }, [user, addresses, selectedAddressId, useNewAddress]);

  // Prevent empty checkout
  useEffect(() => {
    if (!orderPlaced && !loading && cartItems.length === 0) {
      toast.error("Your cart is empty. Redirecting to cart...", {
        id: "empty-cart",
      });
      router.push("/cart");
    }
  }, [cartItems, loading, orderPlaced, router]);

  useEffect(() => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    setCouponSuccess("");
  }, [subtotal]);

  const validateForm = (values) => {
    const errors = {};
    const requiredFields = [
      "fullName",
      "phone",
      "street",
      "city",
      "state",
      "pincode",
      "country",
    ];

    requiredFields.forEach((field) => {
      if (!String(values[field] || "").trim()) {
        errors[field] = "This field is required";
      }
    });

    if (values.phone && !/^\d{10}$/.test(values.phone.trim())) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    // Postal code validation (exactly 6 digits)
    if (values.pincode && !/^\d{6}$/.test(values.pincode.trim())) {
      errors.pincode = "Pincode must be exactly 6 digits";
    }

    return errors;
  };

  const formErrors = useNewAddress ? validateForm(form) : {};
  const isFormValid = Object.keys(formErrors).length === 0;
  const isCartEmpty = cartItems.length === 0;
  const isSubmitDisabled = loading || isCartEmpty;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setSaveAddress(checked);
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }

    if (name === "pincode") {
      const trimmed = value.trim();
      if (trimmed.length === 6) {
        runCheck(trimmed);
        fetchLocationFromPincode(trimmed);
      } else {
        setLocationStatus({ autoFilled: false, success: null, message: "" });
      }
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleSelectAddress = (id) => {
    setUseNewAddress(false);
    setSelectedAddressId(id);
    const chosen = addresses.find((a) => String(a._id) === String(id));
    if (chosen) {
      setForm((prev) => ({
        ...prev,
        fullName: chosen.fullName || "",
        phone: chosen.phone || "",
        street: chosen.street || "",
        city: chosen.city || "",
        state: chosen.state || "",
        pincode: chosen.pincode || "",
        country: chosen.country || "",
        label: chosen.label || "Home",
        email: user?.email || prev.email || "",
      }));
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await dispatch(setDefaultAddressAction(id)).unwrap();
      toast.success("Default address updated");
      setSelectedAddressId(String(id));
    } catch (err) {
      toast.error(err || "Failed to set default");
    }
  };

  const handleAddNewAddress = () => {
    setUseNewAddress(true);
    setSelectedAddressId(null);
    setEditingAddressId(null);
  };

  const handleSaveAddress = async (payload) => {
    try {
      const action = editingAddressId
        ? updateAddressAction({ id: editingAddressId, data: payload })
        : addAddressAction(payload);
      const updated = await dispatch(action).unwrap();
      await dispatch(fetchAddresses());
      const chosen =
        updated?.find?.((a) => a.isDefault) || updated?.[updated?.length - 1];
      if (chosen?._id) {
        setSelectedAddressId(String(chosen._id));
        setUseNewAddress(false);
        setEditingAddressId(null);
      }
      setForm((prev) => ({ ...prev, ...payload }));
      toast.success(editingAddressId ? "Address updated" : "Address added");
    } catch (err) {
      toast.error(err || "Failed to save address");
    }
  };

  const fetchLocationFromPincode = async (pin) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === "Success" && Array.isArray(data[0].PostOffice) && data[0].PostOffice[0]) {
        const office = data[0].PostOffice[0];
        setForm((prev) => ({
          ...prev,
          city: office?.District || prev.city,
          state: office?.State || prev.state,
        }));
        setLocationStatus({
          autoFilled: true,
          success: true,
          message: "✓ City and State detected automatically",
        });
      } else {
        setLocationStatus({
          autoFilled: false,
          success: false,
          message: "❌ Invalid Pincode",
        });
      }
    } catch (err) {
      // Do not block user
      setLocationStatus({
        autoFilled: false,
        success: false,
        message: "Unable to detect city/state. Please enter manually.",
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (isCartEmpty) {
      setCouponError("Cart is empty");
      return;
    }

    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      const response = await applyCoupon({
        code: couponCode,
        cartTotal: subtotal,
      });

      const discountAmount = Number(response.discount ?? 0);
      setAppliedCoupon({
        code: String(response?.coupon?.code || couponCode).toUpperCase(),
        discount: Number.isFinite(discountAmount) ? discountAmount : 0,
      });
      setCouponCode(String(response?.coupon?.code || couponCode).toUpperCase());
      setCouponSuccess("Coupon applied successfully");
    } catch (error) {
      setAppliedCoupon(null);
      setCouponError(error.message || "Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    setCouponSuccess("");
  };

  const placeOrder = async (e) => {
    e?.preventDefault();
    setSubmitError("");
    setLastPaymentError("");

    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (isCartEmpty) {
      setSubmitError("Cart is empty");
      return;
    }

    if (isPincodeBlocked) {
      setSubmitError("Delivery not available to this pincode");
      toast.error("Delivery not available to this pincode");
      return;
    }

    const selectedAddress =
      addresses.find((a) => String(a._id) === String(selectedAddressId)) ||
      null;

    if (useNewAddress || !selectedAddress) {
      const errors = validateForm(form);
      if (Object.keys(errors).length > 0) {
        setTouched({
          fullName: true,
          phone: true,
          street: true,
          city: true,
          state: true,
          pincode: true,
          country: true,
        });
        setSubmitError("Please fill all required fields correctly.");
        toast.error("Please fill all required fields correctly.");
        return;
      }
    }

    try {
      setLoading(true);

      const shippingAddress =
        !useNewAddress && selectedAddress
          ? selectedAddress
          : {
              fullName: form.fullName,
              phone: form.phone,
              street: form.street,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
              country: form.country,
              label: form.label || "Home",
              isDefault: saveAddress && addresses.length === 0,
            };

      // Save Address if checked and using a new address
      if (useNewAddress && saveAddress && isAuthenticated) {
        try {
          const updated = await dispatch(
            addAddressAction({
              ...shippingAddress,
              isDefault: addresses.length === 0,
            }),
          ).unwrap();
          await dispatch(fetchAddresses());
          await dispatch(loadUser());
          const newDefault =
            updated?.find?.((a) => a.isDefault) ||
            updated?.[updated?.length - 1];
          if (newDefault?._id) {
            setSelectedAddressId(String(newDefault._id));
          }
          setUseNewAddress(false);
          toast.success("Address saved to profile");
        } catch (err) {
          console.error("Failed to save address:", err);
          toast.error("Order proceeding, but failed to save address.");
        }
      }

      const payload = {
        items: cartItems.map((item) => ({
          productId: item.productId || item._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        couponCode: appliedCoupon?.code || undefined,
        orderNotes,
      };

      // COD flow
      if (paymentMethod === "cod") {
        const order = await createOrder({
          ...payload,
          paymentMethod: "cod",
          paymentStatus: "pending",
        });
        setOrderPlaced(true);
        await dispatch(clearCartAsync());
        toast.success("Order placed with Cash on Delivery");
        const orderId = order?._id || order?.id || order?.orderId;
        if (orderId) setCreatedOrderId(orderId);
        router.push(
          orderId ? `/order-success?orderId=${orderId}` : "/order-success",
        );
        return;
      }

      // Online payment flow
      // const rpOrder = await createRazorpayOrder(total);
      const rpOrder = await createRazorpayOrder({
        items: cartItems,
        couponCode: appliedCoupon?.code,
      });
      const order = await createOrder({
        ...payload,
        paymentMethod: "razorpay",
        paymentStatus: "pending",
        razorpayOrderId: rpOrder?.orderId,
      });

      const orderId = order?._id || order?.id || order?.orderId;
      if (orderId) setCreatedOrderId(orderId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rpOrder?.amount,
        currency: rpOrder?.currency || "INR",
        name: "Farmizo",
        order_id: rpOrder?.orderId,
        prefill: {
          name: form.fullName,
          email: user?.email || "",
          contact: form.phone,
        },
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });
            setOrderPlaced(true);
            await dispatch(clearCartAsync());
            toast.success("Payment successful and order confirmed!");
            router.push(
              orderId ? `/order-success?orderId=${orderId}` : "/order-success",
            );
          } catch (errVerify) {
            setLastPaymentError(
              errVerify.message || "Payment verification failed",
            );
            toast.error(errVerify.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setLastPaymentError("Payment popup closed. Please retry.");
          },
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
      };

      if (typeof window !== "undefined") {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (resp) => {
          setLastPaymentError(
            resp.error?.description || "Payment failed. Retry.",
          );
          setLoading(false);
        });
        rzp.open();
      }
    } catch (err) {
      setSubmitError(err.message || "Order failed");
      toast.error(err.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (isCartEmpty) {
    if (orderPlaced) {
      return (
        <main className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2 text-text-heading">
            Finalizing your order…
          </h2>
          <p className="text-text-muted">Redirecting to confirmation page.</p>
        </main>
      );
    }

    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-semibold mb-4 text-text-heading">
          Your cart is empty
        </h2>
        <p className="text-text-muted mb-6">
          Add some items before checking out.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="bg-action-primary hover:bg-action-primary-hover text-white px-6 py-3 rounded-lg transition"
        >
          Browse Products
        </button>
      </main>
    );
  }

  return (
    <main>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <section className="bg-bg-section-soft">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center lg:py-20 lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold text-text-heading">
            Checkout
          </h1>
          <p className="mt-3 text-sm lg:text-base text-text-muted">
            Review your items and enter shipping details.
          </p>
        </div>
      </section>

      <section className="bg-bg-page">
        <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-10">
          {/* Shipping Form - Left Column */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-border-default shadow-sm">
              <h2 className="text-xl font-bold text-text-heading mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-action-primary/10 text-action-primary flex items-center justify-center text-sm">
                  1
                </span>
                Shipping Details
              </h2>

              <form
                id="checkout-form"
                onSubmit={placeOrder}
                className="grid sm:grid-cols-2 gap-x-6 gap-y-5"
              >
                <div className="sm:col-span-2">
                  <AddressSelector
                    addresses={addresses}
                    selectedId={selectedAddressId}
                    onSelect={handleSelectAddress}
                    onAddNew={handleAddNewAddress}
                    onMakeDefault={handleSetDefault}
                    onEdit={(addr) => {
                      setUseNewAddress(true);
                      setEditingAddressId(addr._id);
                      setSelectedAddressId(null);
                      setForm({ ...form, ...addr });
                    }}
                    onDelete={async (id) => {
                      try {
                        await dispatch(deleteAddressAction(id)).unwrap();
                        // await dispatch(fetchAddresses());
                        try {
                          await dispatch(fetchAddresses());
                        } catch (err) {
                          console.error("Failed to fetch addresses", err);
                        }
                        toast.success("Address deleted");
                        setSelectedAddressId(null);
                        setUseNewAddress(true);
                      } catch (err) {
                        toast.error(err || "Failed to delete address");
                      }
                    }}
                  />
                </div>
                {useNewAddress && (
              <div className="sm:col-span-2 rounded-2xl border border-border-default bg-bg-section-muted p-4">
                <h3 className="text-sm font-semibold text-text-heading mb-3">
                  {editingAddressId ? "Edit Address" : "Add New Address"}
                </h3>
                <AddressForm
                      initialData={
                        editingAddressId
                          ? addresses.find(
                              (a) => String(a._id) === String(editingAddressId),
                            )
                          : form
                      }
                      onSubmit={handleSaveAddress}
                      onCancel={() => {
                        setUseNewAddress(false);
                        setEditingAddressId(null);
                      }}
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
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Leave at door / Call before delivery"
                    className="w-full px-4 py-3 rounded-lg border bg-bg-page focus:ring-2 focus:ring-action-primary/50 outline-none transition resize-none border-border-default"
                    rows={3}
                  />
                </div>
                {[
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
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-text-heading mb-1.5">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      placeholder={field.placeholder}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required={useNewAddress}
                      disabled={(field.name === "city" || field.name === "state") && locationStatus.autoFilled}
                      className={`w-full px-4 py-2.5 rounded-lg border bg-bg-page focus:ring-2 focus:ring-action-primary/50 outline-none transition ${
                        useNewAddress &&
                        touched[field.name] &&
                        formErrors[field.name]
                          ? "border-red-500 focus:border-red-500 bg-red-50"
                          : "border-border-default hover:border-border-hover focus:border-action-primary"
                      }`}
                    />
                    {useNewAddress &&
                      touched[field.name] &&
                      formErrors[field.name] && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                          {formErrors[field.name]}
                        </p>
                      )}
                    {field.name === "pincode" && locationStatus.message && (
                      <p
                        className={`mt-1 text-xs font-semibold ${
                          locationStatus.success ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {locationStatus.message}
                      </p>
                    )}
                    {field.name === "pincode" && pincodeStatus.serviceable === true && (
                      <p className="mt-1 text-xs font-semibold text-green-600">
                        ✓ Delivery available in {pincodeStatus.deliveryDays || 3}-{(pincodeStatus.deliveryDays || 3) + 2} days
                      </p>
                    )}
                    {field.name === "pincode" && pincodeStatus.serviceable === false && (
                      <p className="mt-1 text-xs font-semibold text-red-600">
                        ❌ Delivery not available
                      </p>
                    )}
                    {field.name === "pincode" && pincodeError && (
                      <p className="mt-1 text-xs text-red-600">{pincodeError}</p>
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={useNewAddress}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-bg-page focus:ring-2 focus:ring-action-primary/50 outline-none transition ${
                      useNewAddress && touched.city && formErrors.city
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "border-border-default hover:border-border-hover focus:border-action-primary"
                    }`}
                  />
                  {useNewAddress && touched.city && formErrors.city && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={useNewAddress}
                    className={`w-full px-4 py-2.5 rounded-lg border bg-bg-page focus:ring-2 focus:ring-action-primary/50 outline-none transition ${
                      useNewAddress && touched.state && formErrors.state
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "border-border-default hover:border-border-hover focus:border-action-primary"
                    }`}
                  />
                  {useNewAddress && touched.state && formErrors.state && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={useNewAddress}
                    className={`w-full px-4 py-3 rounded-lg border bg-bg-page focus:ring-2 focus:ring-action-primary/50 outline-none transition resize-none ${
                      useNewAddress && touched.street && formErrors.street
                        ? "border-red-500 focus:border-red-500 bg-red-50"
                        : "border-border-default hover:border-border-hover focus:border-action-primary"
                    }`}
                  />
                  {useNewAddress && touched.street && formErrors.street && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {formErrors.street}
                    </p>
                  )}
                </div>

                {/* Save Address Checkbox */}
                {(useNewAddress || addresses.length === 0) && (
                  <div className="sm:col-span-2 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          name="saveAddress"
                          checked={saveAddress}
                          onChange={handleChange}
                          className="peer w-5 h-5 cursor-pointer appearance-none rounded border border-border-default bg-bg-page checked:bg-action-primary checked:border-action-primary hover:border-border-hover transition"
                        />
                        <svg
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white"
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

            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-border-default shadow-sm">
              <h2 className="text-xl font-bold text-text-heading mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-action-primary/10 text-action-primary flex items-center justify-center text-sm">
                  2
                </span>
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                  />
                  <span className="font-medium text-text-heading">
                    Pay Online (Razorpay)
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span className="font-medium text-text-heading">
                    Cash on Delivery
                  </span>
                </label>
                {lastPaymentError && (
                  <p className="text-sm text-red-600">
                    Payment failed: {lastPaymentError} — click Place Order to
                    retry.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 bg-bg-section-muted p-6 lg:p-8 rounded-2xl border border-border-default shadow-sm">
              <h2 className="text-xl font-bold text-text-heading mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-action-primary/10 text-action-primary flex items-center justify-center text-sm">
                  3
                </span>
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-3 py-3">
                  <span className="text-lg">🚚</span>
                  <div>
                    <p className="text-sm font-semibold text-text-heading">Estimated Delivery</p>
                    <div className="text-sm text-green-600">
                      Delivered in {deliveryDays}-{deliveryDays + 2} business days
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mt-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 items-start bg-white p-3 rounded-xl border border-border-default"
                  >
                    <Image
                      src={item.images?.[0] || "/placeholder.png"}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="rounded-lg object-cover flex-shrink-0 border border-border-default"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-heading text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-action-primary mt-1">
                        Rs. {formatMoney(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mt-6 pt-6 border-t border-border-default">
                <label className="block text-sm font-medium text-text-heading mb-2">
                  Discount Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      if (couponError) setCouponError("");
                      if (couponSuccess) setCouponSuccess("");
                    }}
                    placeholder="Enter Code"
                    disabled={couponLoading || !!appliedCoupon}
                    className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-border-default bg-white focus:ring-2 focus:ring-action-primary/50 outline-none uppercase disabled:opacity-60 disabled:bg-bg-page"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={
                      couponLoading || !!appliedCoupon || !couponCode.trim()
                    }
                    className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-text-heading text-white hover:bg-black disabled:opacity-50 transition"
                  >
                    {couponLoading ? "Wait..." : "Apply"}
                  </button>
                </div>

                {/* Coupon States */}
                {appliedCoupon?.code && (
                  <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                    <span className="text-xs font-semibold text-green-700 font-mono">
                      {appliedCoupon.code}
                    </span>
                    <button
                      type="button"
                      onClick={removeAppliedCoupon}
                      className="text-xs font-medium text-red-600 hover:text-red-800 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponSuccess && !appliedCoupon && (
                  <p className="mt-2 text-xs font-medium text-green-600 flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {couponSuccess}
                  </p>
                )}
                {couponError && (
                  <p className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {couponError}
                  </p>
                )}
              </div>

              {/* Price Calculation */}
              <div className="mt-6 border-t border-border-default pt-5 space-y-3">
                <div className="flex justify-between text-sm text-text-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-text-heading">
                    Rs. {formatMoney(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Discount applied</span>
                    <span>-Rs. {formatMoney(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-text-muted">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-text-heading">
                    {shipping === 0 ? "Free" : `Rs. ${formatMoney(shipping)}`}
                  </span>
                </div>

                <div className="flex justify-between items-end pt-3 text-lg font-bold text-text-heading border-t border-border-default border-dashed">
                  <span>Total Payable</span>
                  <span className="text-xl text-action-primary">
                    Rs. {formatMoney(total)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitDisabled}
                className="mt-8 w-full bg-action-primary hover:bg-action-primary-hover text-white py-4 rounded-xl font-bold text-lg shadow-md shadow-action-primary/20 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Order...
                  </>
                ) : (
                  <>
                    Confirm & Pay
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </button>

              {submitError && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-red-600 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">
                    {submitError}
                  </p>
                </div>
              )}

              <p className="mt-4 text-xs text-center text-text-muted flex items-center justify-center gap-1.5">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Secure and Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
