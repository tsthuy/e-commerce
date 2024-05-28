import axios from "axios";
import { server } from "../../server";
import {
  getAllSellerFailed,
  getAllSellersRequest,
  getAllSellersSuccess,
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
