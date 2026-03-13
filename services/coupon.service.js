import api from "./api";

const extractData = (res) => res?.data?.data ?? res?.data;
const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

export const applyCoupon = async ({ code, cartTotal }) => {
  try {
    const res = await api.post("/coupons/apply", { code, cartTotal });
    const data = res.data || {};
    return {
      success: Boolean(data.success),
      discount: Number(data.discount || 0),
      newTotal: Number(data.newTotal || 0),
      coupon: data.coupon || null,
    };
  } catch (err) {
    const message = getErrorMessage(err, "Failed to apply coupon");
    const normalizedError = new Error(message);
    normalizedError.response = err.response;
    throw normalizedError;
  }
};

export const createCoupon = async (payload) => {
  try {
    const res = await api.post("/admin/coupons", payload);
    return extractData(res);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to create coupon"));
  }
};

export const getAdminCoupons = async () => {
  try {
    const res = await api.get("/admin/coupons");
    const data = extractData(res);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to load coupons"));
  }
};

export const updateCoupon = async (id, payload) => {
  try {
    const res = await api.put(`/admin/coupons/${id}`, payload);
    return extractData(res);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to update coupon"));
  }
};

export const deleteCoupon = async (id) => {
  try {
    const res = await api.delete(`/admin/coupons/${id}`);
    return extractData(res);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to delete coupon"));
  }
};
