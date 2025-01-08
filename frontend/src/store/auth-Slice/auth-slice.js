import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  user: null,
  loggedIn: false,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "/auth/Register",
  async (formData, { rejectWithValue }) => {
    const res = await axios.post(
      "http://localhost:3006/auth/Register",
      formData,
      { withCredentials: true }
    );
    return res.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/Login",
  async (formData, { rejectWithValue }) => {
    const response = await axios.post(
      "http://localhost:3006/auth/login",
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
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
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.loggedIn = false;
      state.user = null;
      state.error = action.payload;
    });

    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.loggedIn = false;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.loggedIn = false;
      state.user = null;
      state.isAuthenticated = false;
      if (action.error.message) {
        state.error = action.error.message;
      } else if (action.error.response?.data?.message) {
        state.error = action.error.response.data.message; // Fallback for server message
      } else {
        state.error = "An unknown error occurred.";
      }
    });
  },
});

export const { setUser, setAuth, setLoggedIn, setLoading } = authSlice.actions;
export default authSlice.reducer;
