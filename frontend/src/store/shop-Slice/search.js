import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const SearchByKeyword = createAsyncThunk(
  "shop/searchbar",
  async (keyword, { rejectWithValue }) => {
    console.log(keyword);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API_URL}/search/searchbar/${keyword}` // Include keyword dynamically
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data || "Error fetching search results"
      );
    }
  }
);

const initialState = {
  searchResults: [],
  isLoading: false,
};

const searchbarSlice = createSlice({
  name: "searchbar",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SearchByKeyword.pending, (state) => {
        state.isLoading = true;
        //  state.searchbar = [];
      })
      .addCase(SearchByKeyword.fulfilled, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(SearchByKeyword.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
      });
  },
});

export default searchbarSlice.reducer;

export const { resetSearchResults } = searchbarSlice.actions;
