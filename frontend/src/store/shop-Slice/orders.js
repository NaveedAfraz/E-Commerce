import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  error: null, // Add an error property to the state
};
export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://e-commerce-zfp2.onrender.comorders/createOrders",
        orderData
      );
      return response.data;
    } catch (error) {
      // Extract and return the error message from the backend
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId }, { rejectWithValue }) => {
    console.log(payerId, paymentId, orderId);
    try {
      const response = await axios.post(
        "https://e-commerce-zfp2.onrender.comorders/capturePayment",
        {
          paymentId,
          payerId,
          orderId,
        }
      );
      return response.data; // return successful data
    } catch (error) {
      // If error occurs, return the backend error message (if present)
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllOrderDetails = createAsyncThunk(
  "/order/getAllOrderDetails",
  async (orderId, { rejectWithValue }) => {
    console.log("orderId", orderId);
    try {
      const response = await axios.get(
        `https://e-commerce-zfp2.onrender.comorders/getAllOrders/${orderId}`
      );
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSpecificOrderDetails = createAsyncThunk(
  "/order/getSpecificOrderDetails",
  async (orderId, { rejectWithValue }) => {
    console.log("orderId", orderId);
    try {
      const response = await axios.get(
        `https://e-commerce-zfp2.onrender.comorders/getSpecificOrderDetails/${orderId}`
      );
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        console.log("action", action);

        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        console.log("action", action);

        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
        state.error = action?.payload || action.error?.message;
      });
    // Adding the capturePayment case
    builder
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear previous error
      })
      .addCase(capturePayment.fulfilled, (state, action) => {
        console.log("action", action);

        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(capturePayment.rejected, (state, action) => {
        console.log("action", action);

        state.isLoading = false;
        state.orderDetails = null;
        state.error = action.payload || action.error?.message; // Display backend message if available
      });
    builder
      .addCase(getAllOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrderDetails.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.orderList = action.payload.orderDetails;
      })
      .addCase(getAllOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        error = action.response.data.message;
        console.log(error);
      });

    builder
      .addCase(getSpecificOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSpecificOrderDetails.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getSpecificOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export default shoppingOrderSlice.reducer;
