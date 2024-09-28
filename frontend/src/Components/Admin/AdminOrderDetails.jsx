import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsFillBagFill } from "react-icons/bs";
import styles from "../../styles/styles.js";

const AdminOrderDetails = ({ setOpen, order }) => {
    const [user, setUser] = useState(null);
    const [seller, setSeller] = useState(null); // Tạo state để lưu tất cả seller

    useEffect(() => {
        if (order) {
            // Lưu thông tin user từ order
            setUser(order?.user);
            setSeller(order?.cart[0]?.shop); // Lưu thông tin seller từ order

        }
    }, [order]);

    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
            <div className="w-[90%] 800px:w-[70%] h-[90vh] bg-white rounded-md shadow p-4 overflow-y-scroll">
                <div className="w-full flex justify-end">
                    <RxCross1
                        size={30}
                        className="cursor-pointer"
                        onClick={() => setOpen(false)}
                    />
                </div>
                {order && (
                    <div className={`py-4 min-h-screen ${styles.section}`}>
                        <div className="w-full flex items-center justify-between">
                            <div className="flex items-center">
                                <BsFillBagFill size={30} color="crimson" />
                                <h1 className="pl-2 text-[25px]">Order Details</h1>
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-between pt-6">
                            <div className="text-[#00000084]">
                                Order ID: <span>#{order?._id?.slice(0, 8)}</span>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-center items-center flex flex-col">
                                    {user && (
                                        <>
                                            <img
                                                src={user?.avatar.url}
                                                alt={user?.name}
                                                className="w-[50px] h-[50px] rounded-full"
                                            />
                                            <span className="text-[16px]">{user.name + "(user)"}</span>

                                        </>
                                    )}
                                </div>
                                <div className="text-center items-center flex flex-col">
                                    {seller && (
                                        <>
                                            <img
                                                src={seller?.avatar.url}
                                                alt={seller?.name}
                                                className="w-[50px] h-[50px] rounded-full"
                                            />
                                            <span className="text-[16px] ">{seller.name + "(seller)"}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>





                        {/* Hiển thị sản phẩm của order */}
                        <h4 className="pt-3 text-[20px] font-[600]">Order Items:</h4>
                        {order.cart.map((item, index) => (
                            <div className="w-full flex items-start mb-5" key={index}>
                                <img
                                    src={`${item.images[0]?.url}`}
                                    alt={item.name}
                                    className="w-[80px] h-[80px]"
                                />
                                <div className="w-full">
                                    <h5 className="pl-3 text-[20px]">{item.name}</h5>
                                    <h5 className="pl-3 text-[20px] text-[#00000091]">
                                        US${item.discountPrice} x {item.qty}
                                    </h5>
                                    <h5 className="pl-3 text-[20px]">{item.shop.name}</h5>
                                </div>
                            </div>
                        ))}

                        <div className="border-t w-full text-right">
                            <h5 className="pt-3 text-[18px]">
                                Total Price: <strong>US${order?.totalPrice}</strong>
                            </h5>
                        </div>
                        <div className="flex justify-between text-center">
                            {/* Hiển thị địa chỉ giao hàng */}
                            <div className="w-full pt-5">
                                <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
                                <p>{order?.shippingAddress?.address1}</p>
                                <p>{order?.shippingAddress?.address2}</p>
                                <p>{order?.shippingAddress?.city}, {order?.shippingAddress?.country}</p>
                                <p>Zip Code: {order?.shippingAddress?.zipCode}</p>
                            </div>

                            {/* Hiển thị thông tin thanh toán */}
                            <div className="w-full pt-5">
                                <h4 className="pt-3 text-[20px] font-[600]">Payment Info:</h4>
                                <p>Status: {order?.paymentInfo?.status || "Not Paid"}</p>
                            </div>

                            {/* Hiển thị trạng thái order */}
                            <div className="w-full pt-5">
                                <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>
                                <p className="text-green-500">{order?.status}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrderDetails;
