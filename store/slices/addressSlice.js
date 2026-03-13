"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProfile as getProfileAPI,
  addAddress as addAddressAPI,
  updateAddress as updateAddressAPI,
  deleteAddress as deleteAddressAPI,
  setDefaultAddress as setDefaultAddressAPI,
} from "@/services/user.service";

const baseError = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const profile = await getProfileAPI();
      return profile?.addresses || [];
    } catch (err) {
      return rejectWithValue(baseError(err, "Failed to load addresses"));
    }
  },
);

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (payload, { rejectWithValue }) => {
    try {
      const profile = await addAddressAPI(payload);
      return profile?.addresses || [];
    } catch (err) {
      return rejectWithValue(baseError(err, "Failed to add address"));
    }
  },
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const profile = await updateAddressAPI(id, data);
      return profile?.addresses || [];
    } catch (err) {
      return rejectWithValue(baseError(err, "Failed to update address"));
    }
  },
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const profile = await deleteAddressAPI(id);
      return profile?.addresses || [];
    } catch (err) {
      return rejectWithValue(baseError(err, "Failed to delete address"));
    }
  },
);

export const setDefaultAddress = createAsyncThunk(
  "address/setDefaultAddress",
  async (id, { rejectWithValue }) => {
    try {
      const profile = await setDefaultAddressAPI(id);
      return profile?.addresses || [];
    } catch (err) {
      return rejectWithValue(baseError(err, "Failed to set default address"));
    }
  },
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.list = action.payload || [];
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.list = action.payload || [];
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.list = action.payload || [];
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.list = action.payload || [];
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
