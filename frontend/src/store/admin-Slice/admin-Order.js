import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  OrderDetails: null,
  productsSold: null,
  isLoading: false,
  topSellingProducts: [],
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API_URL}/adminOrders/getAllOrders`
    );

    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_API_URL
      }/adminOrders/getSpecificOrderDetails/${id}`
    );

    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    console.log(id);

    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_API_URL}/adminOrders/update/${id}`,
      {
        orderStatus,
      }
    );

    return response.data;
  }
);

export const productsSold = createAsyncThunk(
  "/order/productsSold",
  async ({ cartDetails, user }) => {
    console.log(cartDetails, user);

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_API_URL}/adminOrders/productsSold`,
      {
        cartDetails,
        user,
      }
    );
    return response.data;
  }
);

export const topSellingProducts = createAsyncThunk(
  "/order/topSellingProducts",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API_URL}/adminOrders/topSellingProducts`
    );
    return response.data;
  }
);
const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");
      state.OrderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.orderDetails;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      });

    builder
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.OrderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.OrderDetails = null;
      });

    builder
      .addCase(productsSold.pending, (state) => {
        state.isLoading = true;
        state.productsSold = null;
        state.OrderDetails = null;
      })
      .addCase(productsSold.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productsSold = action.payload;
        console.log(action.payload);
        state.OrderDetails = null;
      })
      .addCase(productsSold.rejected, (state) => {
        state.isLoading = false;
        state.productsSold = null;
        state.OrderDetails = null;
      });

    builder
      .addCase(topSellingProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(topSellingProducts.fulfilled, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.topSellingProducts = action.payload;
      })
      .addCase(topSellingProducts.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
