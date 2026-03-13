"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logoutUser } from "@/store/slices/authSlice";
import {
  addToWishlist as addToWishlistAPI,
  clearWishlist as clearWishlistAPI,
  getWishlist as getWishlistAPI,
  removeFromWishlist as removeFromWishlistAPI,
} from "@/services/wishlist.service";

const normalizeWishlistItems = (payload) => {
  const rawItems = Array.isArray(payload?.products) ? payload.products : [];

  return rawItems
    .filter((item) => item?.product?._id)
    .map((item) => ({
      _id: item.product._id,
      name: item.product.name || "",
      slug: item.product.slug || "",
      price: Number(item.product.price || 0),
      images: Array.isArray(item.product.images) ? item.product.images : [],
      stock: Number(item.product.stock || 0),
      isActive: item.product.isActive !== false,
      addedAt: item.addedAt || null,
    }));
};

const getErrorMessage = (err, fallback) =>
  err?.message || fallback;

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth?.isAuthenticated) return [];
      const response = await getWishlistAPI();
      return normalizeWishlistItems(response);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to load wishlist"));
    }
  },
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth?.isAuthenticated) {
        return rejectWithValue("Please login to use wishlist");
      }
      const response = await addToWishlistAPI(productId);
      return normalizeWishlistItems(response);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to add to wishlist"));
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth?.isAuthenticated) {
        return rejectWithValue("Please login to use wishlist");
      }
      const response = await removeFromWishlistAPI(productId);
      return normalizeWishlistItems(response);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to remove from wishlist"));
    }
  },
);

export const clearWishlistAsync = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth?.isAuthenticated) return [];
      const response = await clearWishlistAPI();
      return normalizeWishlistItems(response);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to clear wishlist"));
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlistItems: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load wishlist";
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlistItems = action.payload;
        state.error = "";
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload || "Failed to add item";
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlistItems = action.payload;
        state.error = "";
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload || "Failed to remove item";
      })
      .addCase(clearWishlistAsync.fulfilled, (state, action) => {
        state.wishlistItems = action.payload;
        state.error = "";
      })
      .addCase(clearWishlistAsync.rejected, (state, action) => {
        state.error = action.payload || "Failed to clear wishlist";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.wishlistItems = [];
        state.error = "";
      });
  },
});

export default wishlistSlice.reducer;
