import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Space, Table } from "antd";
import { MdTrackChanges } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { getAllOrdersOfUser } from "../../../redux/actions/order";
import TableDataAntd from "../../../Common/TableDataAntd";
import { AiOutlineTrademark } from "react-icons/ai";

const TrackOrder = () => {
    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();


    console.log(orders);
    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, [dispatch, user._id]);

    const renderAction = (record) => {
        return (
            <div className="flex justify-center">
                <Link to={`/user/track/order/${record.id}`}>
                    <MdTrackChanges className="text-2xl text-blue-500" />
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
            <TableDataAntd data={orders} actionRenderer={renderAction} dataMapping={dataMapping} />
        </div>
    );
};

export default TrackOrder;
