import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllAddresses = createAsyncThunk(
  "address/fetchAllAddresses",
  async (userID, { rejectWithValue }) => {
    console.log("userID", userID);
    try {
      const response = await axios.get(
        `http://localhost:3006/address/fetchAllAddress/${userID}`
      );
      // const data = await response.json();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewAddress = createAsyncThunk(
  "address/addAddress",
  async ({ userID, addressData }, { rejectWithValue }) => {
    console.log("addressData", addressData);
    console.log("userID", userID);

    try {
      const response = await axios.post(
        "http://localhost:3006/address/addAddress",
        {
          userID,
          addressData,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async ({ userID, addressID }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3006/address/deleteAddress/${userID}/${addressID}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ userID, addressData }, { rejectWithValue }) => {
    console.log("addressData", addressData);
    console.log("userID", userID);
    // console.log("addressID", addressID);

    try {
      const response = await axios.put(
        `http://localhost:3006/address/updateAddress/${userID}`,
        { addressData }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  addressList: [],
  isLoading: false,
  error: null,
};
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.addressList = action.payload;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer;
