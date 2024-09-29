import { Children } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../Components/Layout/Loader";

const SellerProtectedLogout = ({ children }) => {
    const { isLoading, isSeller } = useSelector((state) => state.seller);
    if (isLoading === true) {
        return <Loader />;
    } else {
        if (!isSeller && isLoading === false) {
            return <Navigate to="/shop-login" />;
        }
    }
    return children;
};
export default SellerProtectedLogout;