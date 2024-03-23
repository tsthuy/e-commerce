import { createSlice } from "@reduxjs/toolkit";

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    isSeller: false,
    isLoading: false,
    seller: null,
    error: null,
  },
  reducers: {
    LoadSellerRequest: (state) => {
      state.isLoading = true;
    },
    LoadSellerSuccess: (state, action) => {
      state.isSeller = true;
      state.isLoading = false;
      state.seller = action.payload;
    },
    LoadSellerFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSeller = false;
    },

    // get all sellers ---admin
    getAllSellersRequest: (state) => {
      state.isLoading = true;
    },
    getAllSellersSuccess: (state, action) => {
      state.isLoading = false;
      state.sellers = action.payload;
    },
    getAllSellerFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
});
export const {
  LoadSellerRequest,
  LoadSellerSuccess,
  LoadSellerFail,
  getAllSellersRequest,
  getAllSellersSuccess,
  getAllSellerFailed,
  clearErrors,
} = sellerSlice.actions;
export default sellerSlice.reducer;
