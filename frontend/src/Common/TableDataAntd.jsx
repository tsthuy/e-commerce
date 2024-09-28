import React, { useRef, useState } from "react";
import { Button, Input, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const TableDataAntd = ({ data, actionRenderer, extraColumns = [], dataMapping }) => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

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
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
        onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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

    const defaultColumns = [
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            width: 50,
            render: (imageUrl) => (
                <img
                    src={imageUrl}
                    alt="product"
                    style={{ width: "50px", height: "50px" }}
                    className="rounded-lg"
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 150,
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps("name"),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: (status) => (
                <span className={status === "Delivered" ? "text-green-500" : "text-red-700"}>{status}</span>
            ),
            sorter: (a, b) => a.status.localeCompare(b.status),
            ...getColumnSearchProps("status"),
        },
        {
            title: "Items Qty",
            dataIndex: "itemsQty",
            key: "itemsQty",
            width: 130,
            sorter: (a, b) => a.itemsQty - b.itemsQty,
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            width: 130,
            sorter: (a, b) => parseFloat(a.total.replace("US$ ", "")) - parseFloat(b.total.replace("US$ ", "")),
        },
    ];

    // Cột "action" luôn nằm ngoài cùng bên phải
    const actionColumn = {
        title: "",
        key: "action",
        width: 150,
        render: (text, record) => actionRenderer ? actionRenderer(record) : "No action",
    };

    // Combine default columns, extraColumns, and action column
    const columns = [...defaultColumns, ...extraColumns, actionColumn];

    // Generate row data based on dataMapping or default structure
    const generateRowData = () => {
        return data && data.map((item) => ({
            id: item._id,
            ...Object.keys(dataMapping || {}).reduce((acc, key) => {
                acc[key] = dataMapping[key](item);
                return acc;
            }, {}),
        }));
    };

    const row = dataMapping ? generateRowData() : data;

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

export default TableDataAntd;
