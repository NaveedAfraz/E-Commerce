import { configureStore } from "@reduxjs/toolkit";
import adminProductsReducers from "./admin-Slice/admin-slice";
import authReducers from "./auth-Slice/auth-slice";
import shopProductsReducer from "./shop-Slice/shop";
const store = configureStore({
  reducer: {
    auth: authReducers,
    adminProducts: adminProductsReducers,
    shopProducts: shopProductsReducer,
  },
});

export default store;
