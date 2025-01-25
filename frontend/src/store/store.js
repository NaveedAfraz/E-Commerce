import { configureStore } from "@reduxjs/toolkit";
import adminProductsReducers from "./admin-Slice/admin-slice";
import authReducers from "./auth-Slice/auth-slice";
import shopProductsReducer from "./shop-Slice/shop";
import cartReducer from "./shop-Slice/cart";
import addressReducer from "./shop-Slice/address";
import shoppingOrderReducer from "./shop-Slice/orders";
import SearchBarReducer from "./shop-Slice/search";
import adminOrdersReducer from "./admin-Slice/admin-Order";
import reviewsReducer from "./shop-Slice/reviews";
const store = configureStore({
  reducer: {
    auth: authReducers,
    adminProducts: adminProductsReducers,
    shopProducts: shopProductsReducer,
    userCart: cartReducer,
    addresses: addressReducer,
    shoppingOrder: shoppingOrderReducer,
    AdminOrders: adminOrdersReducer,
    searchBar: SearchBarReducer,
    reviews: reviewsReducer,
  },
});

export default store;
