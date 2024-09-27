import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Space, Table } from "antd";
import { MdTrackChanges } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { getAllOrdersOfUser } from "../../../redux/actions/order";

const TrackOrder = () => {
    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    console.log(orders);
    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, [dispatch, user._id]);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="default"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : "",
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            width: 30,
            render: (imageUrl) => (
                <img
                    src={imageUrl}
                    alt="product"
                    style={{ width: "50px", height: "50px", }}
                    className="rounded-lg"
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 150,

            sorter: (a, b) => a.name.localeCompare(b.name),  // Sắp xếp theo tên sản phẩm
            ...getColumnSearchProps("name"),

        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: (status) => (
                <span className={status === "Delivered" ? "text-green-500" : "text-red-700"}>
                    {status}
                </span>
            ),
            ...getColumnSearchProps("status"),
            sorter: (a, b) => a.status.localeCompare(b.status),  // Sắp xếp theo Status
        },
        {
            title: "Items Qty",
            dataIndex: "itemsQty",
            key: "itemsQty",
            width: 130,
            sorter: (a, b) => a.itemsQty - b.itemsQty,  // Sắp xếp theo số lượng sản phẩm
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            width: 130,
            sorter: (a, b) => parseFloat(a.total.replace("US$ ", "")) - parseFloat(b.total.replace("US$ ", "")),  // Sắp xếp theo giá trị tổng
        },
        {
            title: "",
            key: "action",
            width: 150,
            render: (text, record) => (
                <Link to={`/user/track/order/${record.id}`}>
                    <Button icon={<MdTrackChanges size={20} />} />
                </Link>
            ),
        },
    ];

    const row = [];

    orders &&
        orders.forEach((item) => {
            row.push({
                id: item._id,
                name: item.cart[0].name, // Lấy tên sản phẩm
                imageUrl: item.cart[0].images[0].url, // Lấy hình ảnh sản phẩm
                itemsQty: item.cart.length,
                total: "US$ " + item.totalPrice,
                status: item.status,
            });
        });

    return (
        <div className="pl-8 pt-1">
            <Table
                dataSource={row}
                columns={columns}
                pagination={{ pageSize: 10 }}
                rowKey="id"
                bordered
            />
        </div>
    );
};

export default TrackOrder;
