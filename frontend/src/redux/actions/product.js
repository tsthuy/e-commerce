import axios from "axios";
import { server } from "../../server";
import {
  productCreateRequest,
  productCreateSuccess,
  productCreateFail,
  getAllProductsShopFailed,
  getAllProductsRequest,
  getAllProductsShopSuccess,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFailed,
  getAllProductsFailed,
  getAllProductsShopRequest,
  getAllProductsSuccess,
} from "../reducers/product";

// create product
export const createProduct =
  (
    name,
    description,
    category,
    tags,
    originalPrice,
    discountPrice,
    stock,
    shopId,
    images
  ) =>
  async (dispatch) => {
    try {
      dispatch(productCreateRequest());
      console.log(shopId);
      const { data } = await axios.post(`${server}/product/create-product`, {
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        shopId,
        images,
      });
      dispatch(productCreateSuccess(data.product));
    } catch (error) {
      dispatch(productCreateFail(error.response.data.message));
    }
  };

// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch(getAllProductsShopRequest());

    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`
    );
    dispatch(getAllProductsShopSuccess(data.products));
  } catch (error) {
    dispatch(getAllProductsShopFailed(error.response.data.message));
  }
};

// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());
    console.log("hihi")
    const response = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      {
        withCredentials: true,
      },
    );
    console.log(response);
    dispatch(deleteProductSuccess(response.data.message));
  } catch (error) {
    dispatch(deleteProductFailed(error.response.data ? error.response.data.message : error.message));
  }
};

// get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch(getAllProductsRequest());

    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch(getAllProductsSuccess(data.allProducts));
  } catch (error) {
    dispatch(getAllProductsFailed(error.response.data.message));
  }
};
