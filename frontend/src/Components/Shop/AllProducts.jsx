import { Button, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import axios from "axios";
import ProductDetailsCard from "../Route/ProductDetailsCard/ProductDetailsCard";
import { toast } from "react-toastify";
import EditProducts from "./EditProducts";

const AllProducts = () => {
  const { isLoading } = useSelector((state) => state.products);
  const products = useSelector((state) => state.products.products || []); // Ensure products is an array

  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredData, setFilteredData] = useState([]); // Holds filtered data
  const [searchTerm, setSearchTerm] = useState(""); // Holds search term
  const [filterType, setFilterType] = useState("all"); // Holds filter value
  const [openEdit, setOpenEdit] = useState(false);
  const [updated, setUpdated] = useState(false);
  // Fetch all products when component loads
  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, updated, seller._id]);

  // Update data based on products, search term, and filter
  useEffect(() => {
    let updatedData = [...products];
    // Apply filter based on stock or sold out
    if (filterType === "soldOut") {
      updatedData = updatedData.sort((a, b) => b.sold_out - a.sold_out);
    } else if (filterType === "inStock") {
      updatedData = updatedData.sort((a, b) => b.stock - a.stock);
    }

    // Apply search term to filter products by name
    if (searchTerm) {
      updatedData = updatedData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredData(updatedData); // Update the filtered data
    console.log(updatedData.length);

  }, [products, searchTerm, filterType]);

  

  const handleDeleteCheck = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v2/product/delete-shop-product/${id}`,
        { withCredentials: true }
      );
      toast.success("Product deleted successfully");
      setFilteredData(filteredData.filter((item) => item._id !== id));
      setUpdated(!updated);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data === "PRO FEATURE ONLY"
      ) {
        alert("This feature is only available in the pro version.");
      } else {
        alert(
          "An error occurred while deleting the product. Please try again later."
        );
      }
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 180,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record?.images[0]?.url}
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
            onClick={() => {
              setOpen(!open);
              setSelectedProduct(record.product);
            }}
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
            <Button onClick={() => {setOpenEdit(!openEdit);
            setSelectedProduct(record.product);}
            }>
              <AiOutlineEdit size={20} />
            </Button>
          <Button danger onClick={() => handleDeleteCheck(record.id)}>
            <AiOutlineDelete size={20} />
          </Button>
        </div>
      ),
    },
  ];
  console.log(filteredData);
  const row = filteredData.map((item) => ({
    product: item,
    id: item._id,
    name: item.name,
    images: item.images,
    price: "US$ " + item.discountPrice,
    Stock: item.stock,
    sold: item?.sold_out,
  }));

  return (
    <>
      <div className="py-6">
        <div className="flex justify-between py-2">
          
          {/* Filter by Sold Out */}
          <div>
            <Select
              defaultValue="all"
              style={{ width: 200 }}
              onChange={(value) => setFilterType(value)}
            >
              <Select.Option value="all">All Products</Select.Option>
              <Select.Option value="soldOut">Sold Out</Select.Option>
              <Select.Option value="inStock">In Stock</Select.Option>
            </Select>
          </div>
          {/* search */}
          <div style={{ position: "relative", display: "inline-block" }}>
  <input
    type="text"
    placeholder="Search by name"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      padding: "5px 35px 5px 10px", // Extra padding on the right for the icon
      borderRadius: "4px",
      border: "1px solid #ccc",
      width: "200px", // Adjust the width as needed
    }}
  />
  <AiOutlineSearch
    size={20} // Icon size
    style={{
      position: "absolute",
      right: "10px", // Position it inside the input field
      top: "50%",
      transform: "translateY(-50%)", // Center the icon vertically
      color: "#60A5FA", // Icon color
      cursor: "pointer",
    }}
  />
</div>
        {/* add new */}
          <div>
            <Link to={"/dashboard-create-product"}>
            <Button type="default" className="bg-blue-400">
              + Add new
            </Button>
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <Loader />
        ) : (
          <Table
            columns={columns}
            dataSource={row}
            bordered
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
        )}
        {open && <ProductDetailsCard setOpen={setOpen} data={selectedProduct} />}
      </div>
      {openEdit && <EditProducts setOpenEdit={setOpenEdit} data={selectedProduct} filteredData = {filteredData} setFilteredData={setFilteredData} setUpdated={setUpdated} updated={updated}/>}
    </>
  );
};

export default AllProducts;
