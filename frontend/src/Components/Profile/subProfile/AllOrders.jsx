import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../../../redux/actions/order";
import TableDataAntd from "../../../Common/TableDataAntd";
import { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Button } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const handleDeleteOrder = async (id) => {
    try {
      const res = await axios.delete(`${server}/order/shop/delete-order/${id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const renderAction = (record) => {
    return (
      <div className="flex gap-2">

        <Button type="default" className="bg-blue-400 text-white" >
          <Link to={`/user/order/${record.id}`}>Details</Link>
        </Button>
        <Button onClick={() => handleDeleteOrder(record.id)} danger>

          <AiOutlineDelete />

        </Button>
      </div>
    );
  };
  const dataMapping = {
    name: (item) => item.cart[0].name,
    imageUrl: (item) => item.cart[0].images[0].url,
    itemsQty: (item) => item.cart.length,
    total: (item) => "US$ " + item.totalPrice,
    status: (item) => item.status,

  }
  return (
    <div className="">
      <TableDataAntd data={orders} actionRenderer={renderAction} dataMapping={dataMapping} />
    </div>
  );
};

export default AllOrders;