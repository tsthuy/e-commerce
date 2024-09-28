import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Space, Table } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { getAllOrdersOfUser } from "../../../redux/actions/order";
import { MdTrackChanges } from "react-icons/md";
import TableDataAntd from "../../../Common/TableDataAntd";

const AllRefundOrders = () => {
    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.order);
    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, []);
    const dispatch = useDispatch();

    const eligibleOrders =
        orders && orders.filter((item) => item.status === "Processing refund" || item.status === "Refund Success");
    const renderAction = (record) => {
        return (
            <div className="flex justify-center gap-3">
                <Link to={`/user/order/${record.id}`}>
                    <Button className="bg-blue-600">Details</Button>
                </Link>

            </div>
        );
    }
    const dataMapping = {
        name: (item) => item.cart[0].name,
        imageUrl: (item) => item.cart[0].images[0].url,
        itemsQty: (item) => item.cart.length,
        total: (item) => "US$ " + item.totalPrice,
        status: (item) => item.status,
        createdAt: (item) => new Date(item.createdAt).toLocaleString(),
        order: (item) => item // Chuyển createdAt thành chuỗi thời gian
    };
    return (
        <div className="">
            <TableDataAntd data={eligibleOrders} actionRenderer={renderAction} dataMapping={dataMapping} />
        </div>
    );
};
export default AllRefundOrders;