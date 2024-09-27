import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Timeline } from "antd";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const orderStatusSteps = [
    { status: "Processing", label: "Order is being processed." },
    { status: "Transferred to delivery partner", label: "Transferred to delivery partner." },
    { status: "Shipping", label: "On the way to you." },
    { status: "Received", label: "Arrived at your city." },
    { status: "On the way", label: "Delivery man is heading to you." },
    { status: "Delivered", label: "Order has been delivered." },
    { status: "Processing refund", label: "Refund is processing." },
    { status: "Refund Success", label: "Refund was successful." },
  ];

  const currentStepIndex = orderStatusSteps.findIndex(
    (step) => step.status === data?.status
  );

  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      <div className="w-[60%]">
        {data ? (
          <>
            <h1 className="text-[24px] mb-4">Track your order</h1>
            <Timeline>
              {orderStatusSteps.map((step, index) => (
                <Timeline.Item
                  key={step.status}
                  color={index <= currentStepIndex ? "green" : "gray"}
                >
                  {step.label}
                </Timeline.Item>
              ))}
            </Timeline>
            {data?.status === "Delivered" && (
              <div className="mt-4 text-green-600 text-[18px]">
                Congratulations! Your order has been delivered.
              </div>
            )}
          </>
        ) : (
          <div className="text-[20px] text-red-500">
            Unable to find your order details.
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
