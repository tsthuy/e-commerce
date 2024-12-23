import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartRe: (state, action) => {
      const item = action.payload;
      console.log(item);
      const isItemExist = state.cart.find((i) => i._id === item._id);
      if (isItemExist) {
        return {
          ...state,
          cart: state.cart.map((i) => (i._id === isItemExist._id ? item : i)),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, item],
        };
      }
    },

    removeFromCartRe: (state, action) => {
      return {
        ...state,
        cart: state.cart.filter((i) => i._id !== action.payload),
      };
    },
    //clear cart
    clearCart: (state) => {
      return {
        ...state,
        cart: [],
      };
    },
  },
});
export const { addToCartRe, removeFromCartRe, clearCart } = cartReducer.actions;
export default cartReducer.reducer;
