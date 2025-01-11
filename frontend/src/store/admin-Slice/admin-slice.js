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
  async ({ id, formData }) => {
    const res = await axios.put(
      `http://localhost:3006/admin/editProduct/${id}`,
      formData,
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
    const res = await axios.delete(
      `http://localhost:3006/admin/deleteProduct/${id}`
    );
    return res.data;
  }
);
export const getAllProducts = createAsyncThunk(
  "/products/getAllproducts",
  async () => {
    const res = await axios.get("http://localhost:3006/admin/fetchProducts");
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
      state.productList = action.payload.products;
    });
    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.productList = [];
    });
  },
});
 
export default adminProductSlice.reducer