import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyCart,
  addItemToCartDB,
  updateCartItemDB,
  removeCartItemDB,
  clearCartDB,
} from "@/services/cart.service";

const getItemId = (item) =>
  item?.product?._id || item?.product || item?._id || null;

const normalizeCartItems = (items = []) =>
  items.map((item) => {
    const productObj =
      item?.product && typeof item.product === "object" ? item.product : null;
    const id = getItemId(item);

    return {
      ...item,
      _id: id,
      productId: id,
      name: item.name || productObj?.name || "",
      price: item.price ?? productObj?.price ?? 0,
      image:
        item.image ||
        item.images?.[0] ||
        productObj?.images?.[0] ||
        "/placeholder.png",
      quantity: Number(item.quantity) || 1,
    };
  });

/* ================= LOAD CART ================= */
export const loadCart = createAsyncThunk(
  "cart/loadCart",
  async (_, { getState }) => {
    const { auth } = getState();
    if (!auth?.isAuthenticated) return [];

    const res = await getMyCart();
    return normalizeCartItems(res.items || []);
  }
);

/* ================= ADD ITEM ================= */
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ productId, quantity }, { getState }) => {
    const { auth } = getState();

    if (auth?.isAuthenticated) {
      const cart = await addItemToCartDB(productId, quantity);
      return {
        items: normalizeCartItems(cart.items || []),
        productId,
        quantity,
        synced: true,
      };
    }

    return { productId, quantity, synced: false };
  }
);

/* ================= UPDATE ITEM ================= */
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { getState }) => {
    const { auth } = getState();

    if (auth?.isAuthenticated) {
      const cart = await updateCartItemDB(productId, quantity);
      return {
        items: normalizeCartItems(cart.items || []),
        productId,
        quantity,
        synced: true,
      };
    }

    return { productId, quantity, synced: false };
  }
);

/* ================= REMOVE ITEM ================= */
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { getState }) => {
    const { auth } = getState();

    if (auth?.isAuthenticated) {
      const cart = await removeCartItemDB(productId);
      return {
        items: normalizeCartItems(cart.items || []),
        productId,
        synced: true,
      };
    }

    return { productId, synced: false };
  }
);

/* ================= CLEAR CART ================= */
export const clearCartAsync = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState }) => {
    const { auth } = getState();

    if (auth?.isAuthenticated) {
      await clearCartDB();
    }
  }
);

const initialState = {
  items: [],
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    /* ---------- OPTIMISTIC ADD ---------- */
    addToCartOptimistic: (state, action) => {
      const item = action.payload;
      const itemId = item._id || item.productId || item.product;

      const existing = state.items.find(
        (i) => getItemId(i) === itemId
      );

      if (existing) {
        existing.quantity += item.quantity || 1;
        existing.pending = true;
      } else {
        state.items.push({
          ...item,
          _id: itemId,
          productId: itemId,
          quantity: item.quantity || 1,
          pending: true,
        });
      }
    },
  },

  extraReducers: (builder) => {
    builder
      /* LOAD CART */
      .addCase(loadCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      /* ADD ITEM SUCCESS */
      .addCase(addItemToCart.fulfilled, (state, action) => {
        if (action.payload.synced && action.payload.items) {
          state.items = action.payload.items;
          return;
        }
        const id = action.payload.productId;
        const item = state.items.find((i) => getItemId(i) === id);
        if (item) item.pending = false;
      })

      /* ADD ITEM FAILED → ROLLBACK */
      .addCase(addItemToCart.rejected, (state, action) => {
        const id = action.meta.arg.productId;

        const item = state.items.find((i) => getItemId(i) === id);
        if (!item) return;

        if (item.quantity <= 1) {
          state.items = state.items.filter((i) => getItemId(i) !== id);
        } else {
          item.quantity -= 1;
        }
      })

      /* UPDATE */
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (action.payload.synced && action.payload.items) {
          state.items = action.payload.items;
          return;
        }
        const item = state.items.find(
          (i) => getItemId(i) === action.payload.productId
        );
        if (item) item.quantity = action.payload.quantity;
      })

      /* REMOVE */
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (action.payload.synced && action.payload.items) {
          state.items = action.payload.items;
          return;
        }
        state.items = state.items.filter(
          (i) => getItemId(i) !== action.payload.productId
        );
      })

      /* CLEAR */
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { addToCartOptimistic } = cartSlice.actions;
export default cartSlice.reducer;
