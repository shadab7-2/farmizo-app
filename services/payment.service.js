import api from "./api";

const extract = (res) => res?.data?.data ?? res?.data ?? null;

export const createRazorpayOrder = async (amount) => {
  const res = await api.post("/payment/create-order", { amount });
  return extract(res);
};

export const verifyRazorpayPayment = async (payload) => {
  const res = await api.post("/payment/verify", payload);
  return extract(res);
};

export const createCODOrder = async (payload) => {
  const res = await api.post("/payment/cod", payload);
  return extract(res);
};
