const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  productList: [],
  loading: false,
  error: null,
};
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
