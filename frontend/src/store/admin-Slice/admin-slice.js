import axios from "axios";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  productList: [],
  loading: false,
  error: null,
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const res = await axios.post(
      "http://localhost:3006/admin/addProduct",
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
  async (id) => {
    const res = await axios.post(
      `http://localhost:3006/admin/editProduct/${id}`,
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
    const res = await axios.post(
      `http://localhost:3006/admin/deleteProduct/${id}`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return res.data;
  }
);
export const getAllProducts = createAsyncThunk(
  "/products/getAllproducts",
  async () => {
    const res = await axios.get("http://localhost:3006/admin/fetchProducts", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data;
  }
);
const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAdminProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAdminProducts.fulfilled, (state, action) => {
      (state.loading = false), (state.productList = action.payload.products);
    });
    builder.addCase(getAdminProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});
