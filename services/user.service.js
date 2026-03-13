import api from "./api";

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data?.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data?.data;
};

export const changePassword = async (payload) => {
  const response = await api.put("/users/change-password", payload);
  return response.data;
};

export const addAddress = async (payload) => {
  const response = await api.post("/users/address", payload);
  return response.data?.data;
};

export const updateAddress = async (id, payload) => {
  const response = await api.put(`/users/address/${id}`, payload);
  return response.data?.data;
};

export const deleteAddress = async (id) => {
  const response = await api.delete(`/users/address/${id}`);
  return response.data?.data;
};

export const setDefaultAddress = async (id) => {
  const response = await api.put(`/users/address/${id}/default`);
  return response.data?.data;
};
