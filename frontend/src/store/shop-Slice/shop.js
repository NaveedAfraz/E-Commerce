
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  loading: false,
  productList: [],
  productDetails: [],
};

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllproducts",
  async ({ filterParams, sortParams }) => {
    const { category, brand } = filterParams;
    const queryParams = new URLSearchParams();
    console.log("Sort Params: ", sortParams);
    console.log("Filter Params: ", filterParams);
    console.log("Category: ", category);
    console.log("Brand: ", brand);

    if (category) queryParams.append("category", category);
    if (brand) queryParams.append("brand", brand);
    // if (sortBy) queryParams.append("sortBy", sortBy);
    console.log(sortParams);

    if (sortParams) {
      queryParams.append("sortBy", sortParams);
    }
    const res = await axios.get(
      `http://localhost:3006/shop/fetchAllProducts?${queryParams}`
    );
    return res.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    console.log(id);

    const res = await axios.get(
      `http://localhost:3006/shop/fetchProductDetails/${id}`
    );

    console.log(res);
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
      console.log(state.productList);
    });
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.productList = [];
    });
    builder.addCase(fetchProductDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.productDetails = action?.payload?.data;
      console.log(state.productDetails);
    });
    builder.addCase(fetchProductDetails.rejected, (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.error = action.error.message;
      state.productList = [];
      state.productDetails = [];
    });
  },
});

export default shopProductsSlice.reducer;
