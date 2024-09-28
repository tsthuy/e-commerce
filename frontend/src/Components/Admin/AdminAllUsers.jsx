import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../redux/actions/user";
import { AiOutlineDelete } from "react-icons/ai";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Button, Table } from "antd";
import TableData from "../../Common/TableData";

const AdminAllUsers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllUsers());
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "ImageUrl",
      key: "ImageUrl",
      width: 100,
      render: (_, record) => (
        <img
          src={record.imageUrl}
          alt={record.name}
          className="w-[50px] h-[50px] rounded-lg"
        />
      ),
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
      title: "User Role",
      dataIndex: "role",
      key: "role",
      width: 130,
      searchable: true,
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "Joined At",
      dataIndex: "joinedAt",
      key: "joinedAt",
      width: 130,
      sorter: (a, b) => new Date(a.joinedAt) - new Date(b.joinedAt),

    },
    {
      title: "Delete User",
      key: "delete",
      width: 150,
      render: (record) => (
        <Button onClick={() => setUserId(record.id) || setOpen(true)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const dataMapping = {
    id: (item) => item._id,
    imageUrl: (item) => item.avatar.url,
    name: (item) => item.name,
    email: (item) => item.email,
    role: (item) => item.role,
    joinedAt: (item) => item.createdAt.slice(0, 10),
  }


  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">All Users</h3>
        <div className="w-full min-h-[45vh] bg-white rounded">
          <TableData data={users} dataMapping={dataMapping} columns={columns} />
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

export default AdminAllUsers;
