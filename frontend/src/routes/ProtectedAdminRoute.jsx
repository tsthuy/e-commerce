import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../Components/Layout/Loader";

const ProtectedAdminRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  if (loading === false) {
    if (isAuthenticated && !isAuthenticated) {
      return <Navigate to="/login" replace />;
    } else if (user && user.role !== "Admin") {
      return <Navigate to="/" replace />;
    }
    return children;
  }
};
export default ProtectedAdminRoute;
