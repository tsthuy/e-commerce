import React, { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button, Row, Col, Statistic, Table } from "antd";
import { MdBorderClear } from "react-icons/md";

const DashBoardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const availableBalance = seller?.availableBalance.toFixed(2);

  const orderColumns = [
    { title: "Order ID", dataIndex: "id", key: "id" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <span className={text === "Delivered" ? "greenColor" : "redColor"}>
          {text}
        </span>
      ),
    },
    { title: "Items Qty", dataIndex: "itemsQty", key: "itemsQty" },
    { title: "Total", dataIndex: "total", key: "total" },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <Link to={`/dashboard/order/${record.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const orderData = orders
    ? orders.map((item) => ({
        key: item._id,
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "US$ " + item.totalPrice,
        status: item.status,
      }))
    : [];

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <Row gutter={16}>
        <Col span={8}>
          <div className="mb-4 min-h-[20vh] bg-white shadow rounded px-2 py-5">
            <div className="flex items-center">
              <AiOutlineMoneyCollect size={30} className="mr-2" />
              <h3 className="text-[18px] leading-5 font-[400] text-[#00000085]">
                Account Balance{" "}
                <span className="text-[16px]">(with 10% service charge)</span>
              </h3>
            </div>
            <Statistic title="Balance" value={availableBalance} precision={2} />
            {/* <Link className="hidden" to="/dashboard-withdraw-money">
              <h5 className="pt-4 text-[#077f9c]">Withdraw Money</h5>
            </Link> */}
            <br />
            <br />
          </div>
        </Col>
        <Col span={8}>
          <div className="mb-4 min-h-[20vh] bg-white shadow rounded px-2 py-5">
            <div className="flex items-center">
              <MdBorderClear size={30} className="mr-2" />
              <h3 className="text-[18px] leading-5 font-[400] text-[#00000085]">
                All Orders
              </h3>
            </div>
            <Statistic title="Total Orders" value={orders?.length} />
            <Link to="/dashboard-orders">
              <h5 className="pt-4 text-[#077f9c]">View Orders</h5>
            </Link>
          </div>
        </Col>
        <Col span={8}>
          <div className="mb-4 min-h-[20vh] bg-white shadow rounded px-2 py-5">
            <div className="flex items-center">
              <AiOutlineMoneyCollect size={30} className="mr-2" />
              <h3 className="text-[18px] leading-5 font-[400] text-[#00000085]">
                All Products
              </h3>
            </div>
            <Statistic title="Total Products" value={products?.length} />
            <Link to="/dashboard-products">
              <h5 className="pt-4 text-[#077f9c]">View Products</h5>
            </Link>
          </div>
        </Col>
      </Row>
      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <Table
          columns={orderColumns}
          dataSource={orderData}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default DashBoardHero;
