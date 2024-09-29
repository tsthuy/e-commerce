import axios from "axios";
import { server } from "../../server";
import {
  getAllSellerFailed,
  getAllSellersRequest,
  getAllSellersSuccess,
  logoutSellerSuccess,
} from "../reducers/seller";

// get all sellers --- admin
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch(getAllSellersRequest());

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    });

    dispatch(getAllSellersSuccess(data.sellers));
  } catch (error) {
    dispatch(getAllSellerFailed(error.response.data.message));
  }
};
export const logoutSeller = () => async (dispatch) => {
  try {
    const response = await axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });

    if (response.status === 201) {
      // Dispatch để reset lại trạng thái isSeller sau khi logout
      dispatch(logoutSellerSuccess());
      console.log("Logout successful");
    } else {
      console.log("Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
