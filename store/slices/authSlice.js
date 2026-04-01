import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { setAccessToken } from "@/services/api";

const isUsableToken = (value) => {
  if (!value) return false;
  const token = String(value).trim();
  return token !== "" && token !== "undefined" && token !== "null";
};

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);
      return res.data.data; // { user, token }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* ================= REGISTER ================= */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", payload);
      return res.data.data; // { user, token }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Register failed"
      );
    }
  }
);

/* ================= LOAD USER ================= */
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      if (typeof window !== "undefined") {
        const savedToken = localStorage.getItem("farmizo_token");
        if (isUsableToken(savedToken)) {
          setAccessToken(String(savedToken).trim());
        }
      }

      const res = await api.get("/auth/me");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

/* ================= LOGOUT ================= */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Always clear local session even if server request fails
    }
    localStorage.removeItem("farmizo_token");
    localStorage.removeItem("token");
    return true;
  }
);

/* ================= STATE ================= */

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user || action.payload || null;
        state.isAuthenticated = !!state.user;

        // SAVE TOKEN
        if (typeof window !== "undefined") {
          const token = action.payload?.accessToken || action.payload?.token;
          if (isUsableToken(token)) {
            setAccessToken(String(token).trim());
            localStorage.setItem("farmizo_token", String(token).trim());
          } else {
            setAccessToken(null);
            localStorage.removeItem("farmizo_token");
            localStorage.removeItem("token");
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* REGISTER */
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload?.user || action.payload || null;
        state.isAuthenticated = !!state.user;

        if (typeof window !== "undefined") {
          const token = action.payload?.accessToken || action.payload?.token;
          if (isUsableToken(token)) {
            setAccessToken(String(token).trim());
            localStorage.setItem("farmizo_token", String(token).trim());
          } else {
            setAccessToken(null);
            localStorage.removeItem("farmizo_token");
            localStorage.removeItem("token");
          }
        }
      })

      /* LOAD USER */
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      /* LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        setAccessToken(null);
        localStorage.removeItem("farmizo_token");
      });
  },
});

export default authSlice.reducer;
