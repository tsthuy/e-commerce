import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import axios from "axios";
import { server } from "../../server";
import { useState } from "react";
import { Button, Table } from "antd";
import ProductDetailsCard from "../Route/ProductDetailsCard/ProductDetailsCard";

const AllProducts = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setData(res.data.products);
        setOriginalData(res.data.products);
      });
  }, []);
console.log(data);
  const columns = [
   
     {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 180,
    render: (_, record) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={record?.images[0]?.url}  // Now this will correctly access the image URL
          alt={record.name}
          style={{ width: 50, height: 50, marginRight: 10 }}
          className="rounded-lg"
        />
        {record.name}  
      </div>
    ),
  },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
    },
    {
      title: "Stock",
      dataIndex: "Stock",
      key: "Stock",
      width: 80,
    },
    {
      title: "Sold out",
      dataIndex: "sold",
      key: "sold",
      width: 130,
    },
    {
      title: "",
      key: "preview",
      width: 100,
      render: (_, record) => (
        
          <Button>
            <AiOutlineEye
            size={22}
            className=""
            onClick={() =>{ setOpen(!open);
            setSelectedProduct(record.product);
            }
          }
            color="#FA5130"
            title="Quick view"
          />
          </Button>
      ),
    },
      {
          title: "Action",
          key: "action",
          width: 150,
          render: (_, record) => (
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to={`/edit-product/${record.id}`}>
                <Button>
                  <AiOutlineEdit size={20} />
                </Button>
              </Link>
              <Button
                onClick={() => {
                  axios
                    .delete(`${server}/product/admin-delete-product/${record.id}`, {
                      withCredentials: true,
                    })
                    .then((res) => {
                      console.log(res.data.message);
                      setData(data.filter((item) => item._id !== record.id));
                    });
                }}
                danger
              >
                <AiOutlineDelete size={20} />
              </Button>
            </div>
          ),
        }
  ];
  console.log(data);
  const row = [];
  data && data.forEach((item) => {
  row.push({
    product: item,
    id: item._id,
    name: item.name,      // Store name separately
    images: item.images,  // Store images separately
    price: "US$ " + item.discountPrice,
    Stock: item.stock,
    sold: item?.sold_out,
  });
});
console.log(selectedProduct);
  return (
    <>
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
        <Table
       title={() => (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>All Products</h2>
              <input
                type="text"
                placeholder="Search by name"
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();
                  if (value === "") {
                    // Reset to original data when search input is cleared
                    setData(originalData);
                  } else {
                    const filteredData = originalData.filter((item) =>
                      item.name.toLowerCase().includes(value)
                    );
                    setData(filteredData);
                  }
                }}
                style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
          )}
          dataSource={row}
          columns={columns}
          pagination={{ pageSize: 10 }}
          size="small"
        />

        {open ? <ProductDetailsCard setOpen={setOpen} data={selectedProduct} /> : null}
      </div>
    </>
  );
};

export default AllProducts;
