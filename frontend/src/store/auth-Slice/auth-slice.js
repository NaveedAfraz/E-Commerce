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

export const loginUser = createAsyncThunk("auth/login", async (formData) => {
  const response = await axios.post("http://localhost:3006/auth/login", {
    formData: formData,
    withCredentials: true,
  });
  // const data = await res.json();
  return response.data;
});

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

    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.loggedIn = false;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.loading = false;
      state.loggedIn = false;
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});
const { setUser, setAuth, setLoggedIn, setLoading } = counterSlice.actions;
export default counterSlice.reducer;
