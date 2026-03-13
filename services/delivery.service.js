import api from "./api";

export const checkPincode = async (pincode) => {
  const res = await api.get(`/delivery/check/${pincode}`);
  return res.data;
};
