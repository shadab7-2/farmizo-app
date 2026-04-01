import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, // ✅ REQUIRED for sending cookies (refresh token)
});

// ❌ REMOVED: localStorage token logic
// Reason: You are now using httpOnly cookies + in-memory accessToken

// ✅ NEW: In-memory access token
let accessToken = null;

// ✅ NEW: function to set token after login/refresh
export const setAccessToken = (token) => {
  accessToken = token;
};

// 🔥 REQUEST INTERCEPTOR (UPDATED)
api.interceptors.request.use(
  (config) => {
    if (!config.headers) config.headers = {};

    // ✅ Attach token ONLY from memory (NOT localStorage)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 RESPONSE INTERCEPTOR (MAJOR UPGRADE)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ If access token expired → try refresh
    if (
      error?.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // ✅ Call refresh endpoint (cookie will be sent automatically)
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // ✅ Update access token in memory (API returns { data: { accessToken } })
        accessToken = res.data?.data?.accessToken || res.data?.accessToken || null;

        // ✅ Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.log("Session expired, please login again");

        // ❌ REMOVED: localStorage cleanup (not used anymore)

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
