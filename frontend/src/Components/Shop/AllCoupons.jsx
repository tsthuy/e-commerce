import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineSearch } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Button, Select, Table } from "antd";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [coupouns, setCoupouns] = useState([]);
  const [minAmount, setMinAmout] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [value, setValue] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const [couponFilter, setCouponFilter] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        setCoupouns(res.data.couponCodes);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [dispatch]);
  useEffect(() => {
    let updatedData = [...coupouns];

    if (filterType === "name") {
      updatedData = updatedData.sort((a, b) => a.name.localeCompare(b.name)
      );
    } else if (filterType === "value_percent") {
      updatedData = updatedData.sort((a, b) => a.value - b.value);
    }

    if (searchTerm) {
      updatedData = updatedData.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setCouponFilter(updatedData);
  }, [coupouns, searchTerm, filterType]);

  const handleDelete = async (id) => {
    axios
      .delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success("Coupon code deleted succesfully!");
      });
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProduct,
          value,
          shopId: seller._id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Coupon code created successfully!");
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const columns = [
    {
      title: "Code Name",
      dataIndex: "name",
      key: "id",
      width: 150,
    },
    {
      title: "Selected Product",
      dataIndex: "product",
      key: "id",
      width: 150,
      render: (text, record) => {
        console.log(record)
        if (record.product === "All Products") {
          return <div>All Products</div>;
        }
        else {
          return (
            <div className="flex items-center ">
              {record.product}
            </div>
          );
        }
      },
    },
    {
      title: "Min Amount",
      dataIndex: "min_Amount",
      key: "name",
      width: 180,
    },
    {
      title: "Max Amount",
      dataIndex: "max_Amount",
      key: "price",
      width: 100,
    },
    {
      title: "Value",
      dataIndex: "value_percent",
      key: "price",
      width: 100,
    },
    {
      title: "",
      key: "action",
      width: 120,
      render: (text, record) => (
        <Button color="red" onClick={() => handleDelete(record.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const row = [];

  couponFilter &&
    couponFilter.forEach((item) => {
      row.push({
        id: item._id,
        min_Amount: item.minAmount + " $",
        max_Amount: item.maxAmount + " $",
        value_percent: item.value + " %",
        name: item.name,
        product: item.selectedProduct ? item.selectedProduct : "All Products",
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="flex justify-between">
            {/* filter coupons code */}
            <div className="">
              <Select
                defaultValue="all"
                style={{ width: 200 }}
                onChange={(value) => setFilterType(value)}

              >
                <Select.Option value="all">All Coupons</Select.Option>
                <Select.Option value="name">Name</Select.Option>
                <Select.Option value="value_percent">Value</Select.Option>
              </Select>
            </div>
            {/* search */}
            <div className="relative">
              <input type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-[3px] h-[35px] px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <AiOutlineSearch
                size={20}
                className="absolute top-1/2 right-2 transform -translate-y-1/2"
                color="blue"
              />
            </div>
            {/* create new */}
            <div className="">
              <Button onClick={() => setOpen(true)} className="bg-blue-400" color="blue">+ Create New</Button>
            </div>
          </div>
          <Table
            dataSource={row} // Thay thế bằng nguồn dữ liệu thực tế của bạn
            columns={columns}
            bordered
            pagination={{ pageSize: 10 }} // Đặt kích thước trang mong muốn
            rowKey="id" // Đảm bảo bạn có một khóa duy nhất cho mỗi hàng
          />
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[90vh] bg-white rounded-md shadow p-4">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">
                  Create Coupon code
                </h5>
                {/* create coupoun code */}
                <form onSubmit={handleSubmit} aria-required={true}>
                  <br />
                  <div>
                    <label className="pb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your coupon code name..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">
                      Discount Percentenge{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={value}
                      required
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter your coupon code value..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Min Amount</label>
                    <input
                      type="number"
                      name="value"
                      value={minAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setMinAmout(e.target.value)}
                      placeholder="Enter your coupon code min amount..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Max Amount</label>
                    <input
                      type="number"
                      name="value"
                      value={maxAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Enter your coupon code max amount..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Selected Product</label>
                    <select
                      className="w-full mt-2 border h-[35px] rounded-[5px]"
                      value={selectedProduct}
                      onChange={(e) =>
                        setSelectedProduct(e.target.value) ||
                        console.log(selectedProduct)
                      }
                    >
                      <option value="Choose your selected products">
                        Choose a selected product
                      </option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i.name}>
                            {i.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <br />
                  <div>
                    <input
                      type="submit"
                      value="Create"
                      className="appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
