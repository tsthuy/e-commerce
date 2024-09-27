import React from "react";
import { Table } from "antd";
import Loader from "../Components/Layout/Loader";

const TableData = ({ columns, data, loading }) => {
    return (
        <>
            {loading ? (
                <Loader />// Bạn có thể thay thế Loader ở đây nếu muốn
            ) : (

                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    pagination={{ pageSize: 10 }} // Tùy chỉnh page size ở đây nếu muốn
                />

            )}
        </>
    );
};

export default TableData;
