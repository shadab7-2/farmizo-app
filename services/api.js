import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

const isUsableToken = (value) => {
  if (!value) return false;
  const token = String(value).trim();
  return token !== "" && token !== "undefined" && token !== "null";
};

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const rawToken =
      localStorage.getItem("farmizo_token") ||
      localStorage.getItem("token");
    const token = isUsableToken(rawToken) ? String(rawToken).trim() : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("farmizo_token");
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;
