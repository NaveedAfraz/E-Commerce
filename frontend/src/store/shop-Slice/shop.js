import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  isLoading: false,
  productList: [],
};

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllproducts",
  async () => {
    const res = await axios.get("http://localhost:3006/shop/fetchAllProducts");
    return res.data;
  } 
);
const shopProductsSlice = createSlice({
  name: "shopProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.productList = action?.payload?.data;
    });
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.productList = [];
    });
  },
});

export default shopProductsSlice;
