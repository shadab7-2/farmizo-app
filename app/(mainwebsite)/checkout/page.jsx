"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { validateAddressForm } from "@/utils/validation";
import { useCheckoutTotals } from "@/hooks/useCheckoutTotals";
import Script from "next/script";
import ShippingSection from "@/components/checkout/ShippingSection";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderSummary from "@/components/checkout/OrderSummary";

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
import usePincodeCheck from "@/hooks/usePincodeCheck";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cartItems = useSelector((state) => state.cart.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const addresses = useSelector((state) => state.address.list);

  const deliveryDays = useMemo(() => 3 + Math.floor(Math.random() * 3), []);
  const {
    status: pincodeStatus,
    error: pincodeError,
    runCheck,
  } = usePincodeCheck();
  const isPincodeBlocked = pincodeStatus.serviceable === false;
  const [locationStatus, setLocationStatus] = useState({
    autoFilled: false,
    success: null,
    message: "",
  });

  const [formAddress, setFormAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    street: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [saveAddress, setSaveAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // default to COD for initial rollout
  const [lastPaymentError, setLastPaymentError] = useState("");
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const { subtotal, shipping, discount, total } = useCheckoutTotals(
    cartItems,
    appliedCoupon,
  );

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

    if (!showAddressForm) {
      if (defaultAddress && !selectedAddressId) {
        setSelectedAddressId(String(defaultAddress._id));
      } else if (!defaultAddress && !selectedAddressId) {
        setShowAddressForm(true);
      }
    }

    if (showAddressForm) {
      setFormAddress((prev) => ({
        ...prev,
        email: user.email || prev.email || "",
      }));
      return;
    }

    const source =
      addresses.find((a) => String(a._id) === String(selectedAddressId)) ||
      defaultAddress ||
      {};
    setSelectedAddress(source || null);

    setFormAddress((prev) => ({
      ...prev,
      fullName: source.fullName || user.name || prev.fullName || "",
      email: user.email || prev.email || "",
      phone: source.phone || prev.phone || "",
      street: source.street || source.address || prev.street || "",
      address:
        source.address || source.street || prev.address || prev.street || "",
      city: source.city || prev.city || "",
      state: source.state || prev.state || "",
      pincode: source.pincode || prev.pincode || "",
      country: source.country || prev.country || "",
    }));
  }, [user, addresses, selectedAddressId, showAddressForm]);

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

  const formErrors = showAddressForm ? validateAddressForm(formAddress) : {};
  const isCartEmpty = cartItems.length === 0;
  const isSubmitDisabled = loading || isCartEmpty;
  const addressFormInitialData = editingAddressId
    ? addresses.find((a) => String(a._id) === String(editingAddressId))
    : formAddress;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setSaveAddress(checked);
      return;
    }

    const next = {
      ...formAddress,
      [name]: value,
    };

    if (name === "street") {
      next.address = formAddress.address || value;
    }
    if (name === "address") {
      next.street = formAddress.street || value;
    }

    // Ensure country is always set (backend requires it)
    if (!next.country) {
      next.country = "India";
    }

    setFormAddress(next);

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
    setShowAddressForm(false);
    setSelectedAddressId(id);
    const chosen = addresses.find((a) => String(a._id) === String(id));
    if (chosen) {
      setSelectedAddress(chosen);
      setFormAddress((prev) => ({
        ...prev,
        fullName: chosen.fullName || "",
        phone: chosen.phone || "",
        street: chosen.street || chosen.address || "",
        address: chosen.address || chosen.street || "",
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
    setShowAddressForm(true);
    setSelectedAddressId(null);
    setEditingAddressId(null);
  };

  const handleEditAddress = (addr) => {
    setShowAddressForm(true);
    setEditingAddressId(addr._id);
    setSelectedAddressId(null);
    setFormAddress((prev) => ({ ...prev, ...addr }));
  };

  const handleDeleteAddress = async (id) => {
    try {
      await dispatch(deleteAddressAction(id)).unwrap();
      await dispatch(fetchAddresses());
      toast.success("Address deleted");
      setSelectedAddressId(null);
      setShowAddressForm(true);
    } catch (err) {
      toast.error(err || "Failed to delete address");
    }
  };

  const handleCancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  const handleSaveAddress = async (payload) => {
    const validationErrors = validateAddressForm(payload);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fill all required address fields before saving");
      setTouched({
        fullName: true,
        phone: true,
        street: true,
        city: true,
        state: true,
        pincode: true,
        country: true,
      });
      return;
    }
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
        setShowAddressForm(false);
        setEditingAddressId(null);
        setShowAddressForm(false);
        setSelectedAddress(chosen);
      }
      setFormAddress((prev) => ({ ...prev, ...payload }));
      toast.success(editingAddressId ? "Address updated" : "Address added");
    } catch (err) {
      toast.error(err || "Failed to save address");
    }
  };

  const fetchLocationFromPincode = async (pin) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (
        Array.isArray(data) &&
        data[0]?.Status === "Success" &&
        Array.isArray(data[0].PostOffice) &&
        data[0].PostOffice[0]
      ) {
        const office = data[0].PostOffice[0];
        setFormAddress((prev) => ({
          ...prev,
          city: office?.District || prev.city,
          state: office?.State || prev.state,
        }));
        setLocationStatus({
          autoFilled: true,
          success: true,
          message: "City and State detected automatically",
        });
      } else {
        setLocationStatus({
          autoFilled: false,
          success: false,
          message: "Invalid pincode",
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

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCouponCodeChange = (value) => {
    setCouponCode(value);
    if (couponError) setCouponError("");
    if (couponSuccess) setCouponSuccess("");
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

    const selectedSavedAddress =
      addresses.find((a) => String(a._id) === String(selectedAddressId)) ||
      null;
    setSelectedAddress(selectedSavedAddress);

    if (!selectedSavedAddress) {
      setSubmitError("Please select shipping address");
      toast.error("Please select shipping address");
      return;
    }

    const usingSavedAddress = !!selectedSavedAddress;

    try {
      setLoading(true);

      const baseAddress = usingSavedAddress
        ? selectedSavedAddress
        : formAddress;

      const normalizedSelected = usingSavedAddress
        ? {
            ...baseAddress,
            street:
              baseAddress.street ||
              baseAddress.address ||
              formAddress.street ||
              "",
            address:
              baseAddress.address ||
              baseAddress.street ||
              formAddress.address ||
              formAddress.street ||
              "",
            city: baseAddress.city || formAddress.city || "",
            state: baseAddress.state || formAddress.state || "",
            pincode: baseAddress.pincode || formAddress.pincode || "",
            country: baseAddress.country || formAddress.country || "",
            fullName:
              baseAddress.fullName ||
              baseAddress.name ||
              formAddress.fullName ||
              "",
            phone: baseAddress.phone || formAddress.phone || "",
          }
        : null;

      const buildShipping =
        usingSavedAddress && normalizedSelected
          ? normalizedSelected
          : {
              fullName: formAddress.fullName,
              phone: formAddress.phone,
              street: formAddress.street,
              address: formAddress.address || formAddress.street,
              city: formAddress.city,
              state: formAddress.state,
              pincode: formAddress.pincode,
              country: formAddress.country,
              label: formAddress.label || "Home",
              isDefault: saveAddress && addresses.length === 0,
            };

      // sanitize/trim everything to satisfy backend required fields
      const shippingAddress = Object.fromEntries(
        Object.entries(buildShipping || {}).map(([k, v]) => [
          k,
          typeof v === "string" ? v.trim() : v,
        ]),
      );

      // ensure both naming conventions are filled for validation and backend
      if (!shippingAddress.address && shippingAddress.street) {
        shippingAddress.address = shippingAddress.street;
      }
      if (!shippingAddress.street && shippingAddress.address) {
        shippingAddress.street = shippingAddress.address;
      }

      const addressValue = shippingAddress.address || shippingAddress.street;
      const pincodeValue = shippingAddress.pincode;

      const requiredShipping = [
        "fullName",
        "phone",
        "city",
        "state",
        "country",
        "pincode",
      ];
      const missing = requiredShipping
        .filter((key) => !String(shippingAddress?.[key] || "").trim())
        .concat(!String(addressValue || "").trim() ? ["address"] : [])
        .concat(!String(pincodeValue || "").trim() ? ["pincode"] : []);

      if (missing.length) {
        setSubmitError(
          "Please complete the shipping address (missing: " +
            missing.join(", ") +
            ").",
        );
        toast.error("Shipping address incomplete");
        setLoading(false);
        return;
      }

      // Save Address if checked and using a new address
      if (showAddressForm && saveAddress && isAuthenticated) {
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
          setShowAddressForm(false);
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
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        setLoading(false);
        setSubmitError("Payment is temporarily unavailable (missing key). Please use COD or try later.");
        toast.error("Payment setup incomplete. Please try COD or contact support.");
        return;
      }

      const rpOrder = await createRazorpayOrder(Number(total || 0));
      if (!rpOrder?.orderId || !rpOrder?.amount) {
        throw new Error("Failed to initiate payment. Please try again.");
      }
      const order = await createOrder({
        ...payload,
        paymentMethod: "razorpay",
        paymentStatus: "pending",
        razorpayOrderId: rpOrder?.orderId,
      });

      const orderId = order?._id || order?.id || order?.orderId;
      if (!orderId) {
        throw new Error("Could not create order record. Please try again.");
      }
      if (orderId) setCreatedOrderId(orderId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rpOrder?.amount,
        currency: rpOrder?.currency || "INR",
        name: "Farmizo",
        order_id: rpOrder?.orderId,
        prefill: {
          name: formAddress.fullName,
          email: user?.email || "",
          contact: formAddress.phone,
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
            Finalizing your order...
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
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <ShippingSection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              useNewAddress={showAddressForm}
              editingAddressId={editingAddressId}
              form={formAddress}
              touched={touched}
              formErrors={formErrors}
              saveAddress={saveAddress}
              locationStatus={locationStatus}
              pincodeStatus={pincodeStatus}
              pincodeError={pincodeError}
              orderNotes={orderNotes}
              onOrderNotesChange={setOrderNotes}
              onChange={handleChange}
              onBlur={handleBlur}
              onSubmit={placeOrder}
              showAddressForm={showAddressForm}
              onAddNewClick={() => {
                setShowAddressForm(true);
              }}
              onSelectAddress={handleSelectAddress}
              onAddNewAddress={handleAddNewAddress}
              onEditAddress={handleEditAddress}
              onDeleteAddress={handleDeleteAddress}
              onMakeDefaultAddress={handleSetDefault}
              onSaveAddress={handleSaveAddress}
              onCancelAddressForm={handleCancelAddressForm}
              addressFormInitialData={addressFormInitialData}
            />

            <PaymentMethod
              paymentMethod={paymentMethod}
              onChange={handlePaymentMethodChange}
              lastPaymentError={lastPaymentError}
            />
          </div>

          <OrderSummary
            cartItems={cartItems}
            deliveryDays={deliveryDays}
            formatMoney={formatMoney}
            couponCode={couponCode}
            onCouponCodeChange={handleCouponCodeChange}
            couponError={couponError}
            couponSuccess={couponSuccess}
            couponLoading={couponLoading}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={removeAppliedCoupon}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            total={total}
            isSubmitDisabled={isSubmitDisabled}
            loading={loading}
            paymentMethod={paymentMethod}
            submitError={submitError}
          />
        </div>
      </section>
    </main>
  );
}
