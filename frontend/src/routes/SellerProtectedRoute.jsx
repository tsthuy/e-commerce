import { useSelector } from "react-redux";
import Loader from "../Components/Layout/Loader";

const SellerProtectedRoute = ({ children }) => {
  const { isLoading, isSeller } = useSelector((state) => state.seller);
  if (isLoading === true) {
    return <Loader />;
  } else {
    if (!isSeller && isLoading === false) {
      return <Loader />;
    }
  }
  return children;
};
export default SellerProtectedRoute;