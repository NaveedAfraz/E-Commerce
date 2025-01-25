import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  user: null,
  loggedIn: false,
  loading: true,
  error: null,
  userID: null,
  userName: "",
};

export const registerUser = createAsyncThunk(
  "/auth/Register",
  async (formData, { rejectWithValue }) => {
    console.log("formData:", formData);
    const lowerCasedFormData = {
      ...formData,
      email: formData.email.toLowerCase(),
    };
    try {
      const res = await axios.post(
        "https://e-commerce-zfp2.onrender.com/auth/Register",
        lowerCasedFormData,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/Login",
  async (formData, { rejectWithValue }) => {
    const lowerCasedFormData = {
      ...formData,
      email: formData.email.toLowerCase(),
    };
    try {
      const response = await axios.post(
        "https://e-commerce-zfp2.onrender.com/auth/login",
        lowerCasedFormData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const authCheck = createAsyncThunk(
  "auth/authCheck",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://e-commerce-zfp2.onrender.com/auth/authCheck",
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://e-commerce-zfp2.onrender.com/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // setUser: (state, action) => {
    //   state.user = action.payload;
    // },
    // setAuth: (state, action) => {
    //   state.isAuthenticated = action.payload;
    // },
    // setLoggedIn: (state, action) => {
    //   state.loggedIn = action.payload;
    // },
    // setLoading: (state, action) => {
    //   state.loading = action.payload;
    // },
  },
  extraReducers: (builder) => {
    //register user

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

    //login user
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.loggedIn = false;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log(action.payload);
      const { message } = action.payload;
      state.loading = false;
      state.user = message ? action?.payload?.userInfo : null;
      state.isAuthenticated = message;
      state.userID = action?.payload?.userInfo?.UserID;
      state.error = null;
      state.loggedIn = true;
      console.log(state.userID);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.loggedIn = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    });

    //authCheck
    builder.addCase(authCheck.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(authCheck.fulfilled, (state, action) => {
      console.log(action);
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.userID = action?.payload?.UserID;
      state.loggedIn = true;
    });
    builder.addCase(authCheck.rejected, (state, action) => {
      state.loading = false;
      state.loggedIn = false;
      state.user = null;
      state.isAuthenticated = false;
      console.log(action);

      state.error = action.payload;
    });
    //logoutOutUser

    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      console.log(action);
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = false;
      state.error = null;
      state.loggedIn = true;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.loggedIn = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    });
  },
});

// export const { setUser, setAuth, setLoggedIn, setLoading } = authSlice.actions;
export default authSlice.reducer;
