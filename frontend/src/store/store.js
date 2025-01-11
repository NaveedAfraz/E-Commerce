import { configureStore } from "@reduxjs/toolkit";
import adminProductsReducers from "./admin-Slice/admin-slice";
import authReducers from "./auth-Slice/auth-slice";
const store = configureStore({
  reducer: {
    auth: authReducers,
    adminProducts: adminProductsReducers,
  },
});

export default store;
