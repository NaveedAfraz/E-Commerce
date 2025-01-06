import { createSlice } from "@reduxjs/toolkit";
const intialState = {
  isAuthenticated: false,
  user: null,
  loggedIn: false,
  loading: false,
};

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
});
const { setUser, setAuth, setLoggedIn, setLoading } = counterSlice.actions;
export default counterSlice.reducer;
