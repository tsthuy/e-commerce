// add to wishlist
import { addToWishlistRe, removeFromWishlistRe } from "../reducers/wishlist";
export const addToWishlist = (data) => async (dispatch, getState) => {
  dispatch(addToWishlistRe(data));

  localStorage.setItem(
    "wishlistItems",
    JSON.stringify(getState().wishlist.wishlist)
  );
  return data;
};

// remove from wishlist
export const removeFromWishlist = (data) => async (dispatch, getState) => {
  dispatch(removeFromWishlistRe(data._id));
  localStorage.setItem(
    "wishlistItems",
    JSON.stringify(getState().wishlist.wishlist)
  );
  return data;
};
