import { Button, Space, Table } from "antd";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import axios from "axios";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    console.log(id);
    dispatch(deleteProduct(id));
    // window.location.reload();
  };
const handleDeleteCheck = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/v2/product/delete-shop-product/${id}`, {
        withCredentials: true,
      });
      console.log('Product deleted successfully:', response.data);
      // Handle successful deletion (e.g., update UI, show success message)
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data === 'PRO FEATURE ONLY') {
        console.error('This feature is only available in the pro version.');
        // Display an appropriate message to the user
        alert('This feature is only available in the pro version.');
      } else {
        console.error('An error occurred while deleting the product:', error);
        // Handle other errors
        alert('An error occurred while deleting the product. Please try again later.');
      }
    }
  };
  const columns = [
    { title: "Product Id", dataIndex: "id", key: "id", width: 150 },
    { title: "Name", dataIndex: "name", key: "name", width: 180 },
    { title: "Price", dataIndex: "price", key: "price", width: 100 },
    { title: "Stock", dataIndex: "stock", key: "stock", width: 80 },
    { title: "Sold out", dataIndex: "sold", key: "sold", width: 130 },
    {
      title: "Preview",
      key: "preview",
      width: 100,
      render: (_, record) => (
        <Link to={`/product/${record.id}`}>
          <Button icon={<AiOutlineEye />} />
        </Link>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      width: 120,
      render: (_, record) => (
        <Button
          icon={<AiOutlineDelete />}
          onClick={() => handleDeleteCheck(record.id)}
          danger
        />
      ),
    },
  ];

  const data = products
    ? products.map((item) => ({
        key: item._id,
        id: item._id,
        name: item.name,
        price: `US$ ${item.discountPrice}`,
        stock: item.stock,
        sold: item.sold_out,
      }))
    : [];

  return (
    <>
      {isLoading ? <Loader /> : <Table columns={columns} dataSource={data} />}
    </>
  );
};

export default AllProducts;
