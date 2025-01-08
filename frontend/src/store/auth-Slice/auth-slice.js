import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const intialState = {
  isAuthenticated: false,
  user: null,
  loggedIn: false,
  loading: false,
};

export const registerUser = createAsyncThunk(
  "auth/Register",
  async (formData) => {
    const res = await axios.post(
      "http://localhost:3006/auth/Register",

      { formData, withCredentials: true }
    );
    return res.data;
  }
);

const counterSlice = createSlice({
  name: "auth",
  initialState: intialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.loggedIn = false;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = false;
    });
    builder.addCase(registerUser.rejected, (state) => {
      state.loading = false;
      state.loggedIn = false;
      state.user = null;
    });
  },
});
const { setUser, setAuth, setLoggedIn, setLoading } = counterSlice.actions;
export default counterSlice.reducer;
