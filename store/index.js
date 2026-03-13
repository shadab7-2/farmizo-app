import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import wishlistReducer from "./slices/wishlistSlice";
import userProfileReducer from "./slices/userProfileSlice";
import addressReducer from "./slices/addressSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    userProfile: userProfileReducer,
    address: addressReducer,
  },
});
