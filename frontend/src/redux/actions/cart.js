import { addToCartRe, clearCart, removeFromCartRe } from "../reducers/cart";
// add to cart
export const addTocart = (data) => async (dispatch, getState) => {
  console.log(data);
  dispatch(addToCartRe(data));

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};

// remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch(removeFromCartRe(data._id));
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};
// clear cart
export const clearCartAction = () => async (dispatch, getState) => {
  console.log("from hehre");
  dispatch(clearCart());
  localStorage.removeItem("cartItems");
};