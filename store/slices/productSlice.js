import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "@/services/product.service";

export const loadAdminProducts = createAsyncThunk(
  "products/loadAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAdminProducts();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load products"
      );
    }
  }
);

export const addAdminProduct = createAsyncThunk(
  "products/addAdminProduct",
  async (payload, { rejectWithValue }) => {
    try {
      return await createAdminProduct(payload);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        err.message ||
        "Failed to create product";
      return rejectWithValue(
        message
      );
    }
  }
);

export const editAdminProduct = createAsyncThunk(
  "products/editAdminProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateAdminProduct(id, data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const removeAdminProduct = createAsyncThunk(
  "products/removeAdminProduct",
  async (id, { rejectWithValue }) => {
    try {
      await deleteAdminProduct(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  actionLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(loadAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load products";
      })
      .addCase(addAdminProduct.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(addAdminProduct.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(addAdminProduct.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to create product";
      })
      .addCase(editAdminProduct.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(editAdminProduct.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        const index = state.items.findIndex((item) => item._id === updated?._id);
        if (index !== -1) {
          state.items[index] = updated;
        }
      })
      .addCase(editAdminProduct.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to update product";
      })
      .addCase(removeAdminProduct.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(removeAdminProduct.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(removeAdminProduct.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload || "Failed to delete product";
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
