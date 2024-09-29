import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../../server";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import { toast } from "react-toastify";
import TableData from "../../../Common/TableData";
import { Button, Tag } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import Loader from "../../../Components/Layout/Loader";
const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState(null); // Default to null
  const [withdrawStatus, setWithdrawStatus] = useState(""); // Default to an empty string
  const [updated, setUpdated] = useState(false);
  const [withdrawId, setWithdrawId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all withdrawal requests
  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, [updated]);
  console.log(data);
  // Handle deleting a withdrawal request
  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/withdraw/delete-withdraw-request/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setUpdated(!updated);
      });
  };

  // Define columns for the table
  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 50,
      render: (_, record) => (
        <img
          src={record.imageUrl}
          alt={record.name}
          className="w-[50px] h-[50px] rounded-lg"
        />
      ),
    },
    {
      title: "Shop Name",
      dataIndex: "name",
      key: "name",
      width: 100,
      searchable: true,
    },
    {
      title: "Available Balance",
      dataIndex: "availableBalance",
      key: "availableBalance",
      width: 100,
      sorter: (a, b) => b.availableBalance - a.availableBalance,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (text) => (
        <div className="text-red-600 font-bold text-center">${text}</div>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (text) => (
        <Tag color={text === "Processing" ? "orange" : "green"}>{text}</Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Request given at",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Update Status",
      key: "updateStatus",
      width: 130,
      render: (text, record) => {
        return (
          <div className="flex items-center gap-5">
            {record.status === "Processing" ? (
              <BsPencil
                size={20}
                className="cursor-pointer"
                onClick={() => {
                  setOpen(true);
                  setWithdrawData(record.seller._id); // Store the selected withdraw data
                  setWithdrawStatus(record.status); // Set the current status in the dropdown
                  setWithdrawId(record.id);
                }}
              />
            ) : (
              <span>{record.updatedAt || "N/A"}</span>
            )}

            {/* Delete Button */}
            <Button danger onClick={() => handleDelete(record.id)}>
              <AiOutlineDelete />
            </Button>
          </div>
        );
      },
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    },
  ];
  console.log(withdrawData);
  // Handle updating a withdrawal request
  const handleSubmit = async () => {
    setLoading(true);
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawId}`,
        {
          sellerId: withdrawData,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data.message);
        toast.success("Withdraw request updated successfully!");
        setUpdated(!updated); // Trigger re-fetch of data
        setOpen(false);// Close the modal

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Error updating withdraw request");
      });
  };

  // Data mapping for the table
  const dataMapping = {
    id: (item) => item._id,
    imageUrl: (item) => item.seller.avatar.url,
    name: (item) => item.seller.name,
    availableBalance: (item) => item.seller.availableBalance,
    amount: (item) => item.amount,
    status: (item) => item.status,
    createdAt: (item) => item.createdAt.slice(0, 10),
    updatedAt: (item) => (item.updatedAt ? item.updatedAt.slice(0, 10) : ""),
    seller: (item) => item.seller,
  };

  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white">
        <TableData data={data} dataMapping={dataMapping} columns={columns} />
      </div>
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          {loading ? (<Loader />) : (
            <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
              <div className="flex justify-end w-full">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h1 className="text-[25px] text-center font-Poppins">
                Update Withdraw Status
              </h1>
              <br />
              <select
                name=""
                id=""
                onChange={(e) => setWithdrawStatus(e.target.value)}
                className="w-[200px] h-[35px] border rounded"
                value={withdrawStatus} // Set the current value
              >
                <option value="Processing">Processing</option>
                <option value="Succeed">Succeed</option>
              </select>
              <button
                type="submit"
                className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
