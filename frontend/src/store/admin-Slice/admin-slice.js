import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  productList: [],
  loading: false,
  error: null,
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const res = await axios.post(
      "https://e-commerce-zfp2.onrender.com/admin/addProduct",
      formData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  }
);
export const updateProduct = createAsyncThunk(
  "/products/updateProduct",
  async ({ Id, formdata }) => {
    console.log(Id, formdata);
    const res = await axios.put(
      `https://e-commerce-zfp2.onrender.com/admin/editProduct/${Id}`,
      formdata,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  }
);
export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    console.log(id);
    const res = await axios.delete(
      `https://e-commerce-zfp2.onrender.com/admin/deleteProduct/${id}`
    );
    return res.data;
  }
);
export const getAllProducts = createAsyncThunk(
  "/products/getAllproducts",
  async () => {
    const res = await axios.get(
      "https://e-commerce-zfp2.onrender.com/admin/fetchProducts"
    );
    return res.data;
  }
);
const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.productList = action?.payload?.data;
    });
    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.productList = [];
    });
  },
});

export default adminProductSlice.reducer;
