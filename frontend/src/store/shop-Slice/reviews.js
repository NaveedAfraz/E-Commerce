import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addReview = createAsyncThunk(
  "/shopping/review",
  async (
    { userID, productID, reviewMessage, reviewValue },
    { rejectWithValue }
  ) => {
    console.log(reviewMessage, reviewValue);
    console.log("userID", userID);
    console.log("productID", productID);
    try {
      const response = await axios.post(
        `https://e-commerce-zfp2.onrender.comreviews/addReview/${userID}`,
        {
          reviewMessage,
          reviewValue,
          userID,
          productID,
        }
      );
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getReviews = createAsyncThunk(
  "/shopping/getReviews",
  async (productID, { rejectWithValue }) => {
    console.log(productID);
    try {
      const res = await axios.get(
        `https://e-commerce-zfp2.onrender.comreviews/getReviews/${productID}`
      );
      console.log("res", res);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error.response.data);
    }
  }
);
const initialState = {
  reviewsList: [],
  error: null,
  isLoading: false,
};
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        console.log("action.payload", action);

        state.isLoading = false;
        state.reviewsList = action.payload;
        state.error = null;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.msg;
      });
  },
});

export default reviewSlice.reducer;
