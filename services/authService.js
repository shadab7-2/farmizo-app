import api from "./api";

/* ---------------- REGISTER ---------------- */
export const registerUserAPI = (data) =>
  api.post("/auth/register", data);

/* ---------------- LOGIN ---------------- */
export const loginUserAPI = (data) =>
  api.post("/auth/login", data);

/* ---------------- LOAD USER ---------------- */
export const getMeAPI = () =>
  api.get("/auth/me");
