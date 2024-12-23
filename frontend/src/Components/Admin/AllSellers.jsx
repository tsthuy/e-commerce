import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getAllSellers } from "../../redux/actions/seller";
import { Button, Table } from "antd";
import seller from "../../redux/reducers/seller";
import TableDataAntd from "../../Common/TableDataAntd";
import TableData from "../../Common/TableData";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);
  console.log(sellers);
  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllSellers());
  };
  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 120,
      searchable: false,
      render: (_, record) => (
        <img src={record.imageUrl} alt={record.name} className="w-[50px] h-[50px] rounded-lg" />
      ) // Cho phép tìm kiếm
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 130,
      searchable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 130,
      searchable: true,
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Seller Address",
      dataIndex: "sellerAddress",
      key: "sellerAddress",
      width: 130,
      searchable: true,
      sorter: (a, b) => a.sellerAddress.localeCompare(b.sellerAddress),
    },
    {
      title: "Joined At",
      dataIndex: "joinedAt",
      key: "joinedAt",
      width: 130,
      render: (text, record) => <span>{new Date(record.joinedAt).toLocaleDateString()}</span>,
      sorter: (a, b) => new Date(a.joinedAt) - new Date(b.joinedAt),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (text, record) => (
        <div className="flex justify-center gap-3">
          <Link to={`/shop/preview/${record.id}`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
          <Button
            onClick={() => {
              setUserId(record._id);
              setOpen(true);
            }}
            className="bg-blue-600"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const dataMapping = {
    id: (item) => item._id,
    name: (item) => item.name,
    imageUrl: (item) => item.avatar.url,
    email: (item) => item.email,
    sellerAddress: (item) => item.address,
    joinedAt: (item) => item.createdAt.slice(0, 10),
  };



  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">All Users</h3>
        <div className="w-full min-h-[45vh] bg-white rounded">
          <TableData data={sellers} dataMapping={dataMapping} columns={columns} />
        </div>
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Are you sure you wanna delete this user?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  cancel
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() => setOpen(false) || handleDelete(userId)}
                >
                  confirm
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellers;
