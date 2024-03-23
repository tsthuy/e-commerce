import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "../Components/Login/Login";
const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  console.log(isAuthenticated);
  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated === true) {
      navigate("/");
    }
  });
  return (
    <div>
      <Login />
    </div>
  );
};

export default LoginPage;
