import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlistRe: (state, action) => {
      const item = action.payload;
      const isItemExist = state.wishlist.find((i) => i._id === item._id);
      if (isItemExist) {
        state.wishlist = state.wishlist.map((i) =>
          i._id === isItemExist._id ? item : i
        );
      } else {
        state.wishlist.push(item);
      }
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    },
    removeFromWishlistRe: (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload);
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    },
  },
});

export const { addToWishlistRe, removeFromWishlistRe } = wishlistSlice.actions;
export default wishlistSlice.reducer;
