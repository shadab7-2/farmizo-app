"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProfile as getProfileAPI,
  updateProfile as updateProfileAPI,
  addAddress as addAddressAPI,
  updateAddress as updateAddressAPI,
  deleteAddress as deleteAddressAPI,
  changePassword as changePasswordAPI,
} from "@/services/user.service";
import { logoutUser } from "./authSlice";

const baseError = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

export const fetchProfile = createAsyncThunk(
  "userProfile/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth?.isAuthenticated) return null;
      const profile = await getProfileAPI();
      return profile;
    } catch (err) {
      return rejectWithValue(baseError(err, "Failed to load profile"));
    }
  },
);

export const updateProfile = createAsyncThunk(
  "userProfile/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const profile = await updateProfileAPI(payload);
      return profile;
    } catch (err) {
      return rejectWithValue(baseError(err, "Failed to update profile"));
    }
  },
);

export const addAddress = createAsyncThunk(
  "userProfile/addAddress",
  async (payload, { rejectWithValue }) => {
    try {
      const profile = await addAddressAPI(payload);
      return profile;
    } catch (err) {
      return rejectWithValue(baseError(err, "Failed to add address"));
    }
  },
);

export const updateAddress = createAsyncThunk(
  "userProfile/updateAddress",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const profile = await updateAddressAPI(id, data);
      return profile;
    } catch (err) {
      return rejectWithValue(baseError(err, "Failed to update address"));
    }
  },
);

export const deleteAddress = createAsyncThunk(
  "userProfile/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const profile = await deleteAddressAPI(id);
      return profile;
    } catch (err) {
      return rejectWithValue(baseError(err, "Failed to delete address"));
    }
  },
);

export const changePassword = createAsyncThunk(
  "userProfile/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await changePasswordAPI(payload);
      return res?.message || "Password updated";
    } catch (err) {
      return rejectWithValue(baseError(err, "Failed to change password"));
    }
  },
);

const initialState = {
  profile: null,
  addresses: [],
  loading: false,
  updating: false,
  error: null,
  success: null,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.addresses = action.payload?.addresses || [];
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.profile = action.payload;
        state.addresses = action.payload?.addresses || [];
        state.success = "Profile updated";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.addresses = action.payload?.addresses || [];
        state.success = "Address added";
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.addresses = action.payload?.addresses || [];
        state.success = "Address updated";
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.addresses = action.payload?.addresses || [];
        state.success = "Address deleted";
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.success = action.payload || "Password updated";
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { clearProfileState } = userProfileSlice.actions;
export default userProfileSlice.reducer;
