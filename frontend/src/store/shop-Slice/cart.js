import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchcartDetails = createAsyncThunk(
  "cart/fetchcartDetails",
  async (userID, { rejectWithValue }) => {
    try {
      console.log(userID);
      const response = await axios.get(
        `https://e-commerce-zfp2.onrender.com/cart/fetchCartDetails/${userID}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async ({ productDetails, userid }, { rejectWithValue }) => {
    console.log(productDetails, userid);
    try {
      const response = await axios.post(
        "https://e-commerce-zfp2.onrender.com/cart/addToCart",
        {
          productDetails,
          userid,
          quantity: 1,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProductQuantity = createAsyncThunk(
  "cart/updateProductQuantity",
  async ({ userid, productID, action }, { rejectWithValue }) => {
    console.log(userid, productID, action);

    try {
      const response = await axios.put(
        `https://e-commerce-zfp2.onrender.com/cart/UpdateQuantity/${productID}`,
        {
          userid,
          productID,
          action,
          quantity: 1,
          action, // action i sincrement or decrement based on that we will update the quantity
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "cart/deleteProduct",
  async ({ userID, productID }, { rejectWithValue }) => {
    console.log(userID, productID);
    try {
      const response = await axios.delete(
        `https://e-commerce-zfp2.onrender.com/cart/deleteproduct/${userID}/${productID}`
      );
      return { ...response.data, deletedProductID: productID };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cart details
      .addCase(fetchcartDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchcartDetails.fulfilled, (state, action) => {
        console.log(action.payload);

        state.loading = false;
        state.cartItems = action.payload.data;
        state.error = null;
      })
      .addCase(fetchcartDetails.rejected, (state, action) => {
        state.loading = false;
        state.cartItems = [];
        state.error = action.payload?.message || action.error.message;
      })

      // Add product to cart
      .addCase(addProductToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        // console.log(action.payload);
        // console.log("Type of cartItems:", typeof state.cartItems);

        // console.log("Current cartItems:", state.cartItems);
        state.cartItems = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.loading = false;
        state.cartItems = [];
        state.error = action.payload?.message || action.error.message;
      })

      // Update product quantity
      .addCase(updateProductQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        console.log(action.payload);
        console.log("Type of cartItems:", typeof state.cartItems);

        console.log("Current cartItems:", state.cartItems);
        state.loading = false;
        if (!Array.isArray(state.cartItems)) {
          console.error("cartItems is not an array:", state.cartItems);
          state.error = "Invalid cartItems state";
          return;
        }
        state.cartItems = state.cartItems.map((product) =>
          product.productID === action?.payload?.data[0]?.productID
            ? { ...product, quantity: action.payload.data[0]?.quantity }
            : product
        );
        state.error = null;
        console.log("Updated cartItems:", state.cartItems);
      })
      .addCase(updateProductQuantity.rejected, (state, action) => {
        state.loading = false;
        state.cartItems = [];
        state.error = action.payload?.message || action.error.message;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        console.log(action);

        state.loading = false;
        state.cartItems = state.cartItems.filter(
          (item) => item.productID !== action.payload.deletedProductID
        );
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.cartItems = [];
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default cartSlice.reducer;
