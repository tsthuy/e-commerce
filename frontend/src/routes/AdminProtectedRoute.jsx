import React from 'react'
import { useSelector } from 'react-redux';
import Loader from '../Components/Layout/Loader';

function AdminProtectedRoute({ children }) {
    const { user, loading } = useSelector((state) => state.user);
    console.log(user);
    if (loading === true) {
        return <Loader />;
    } else {
        if (user.role === "Admin") {
            return children;;
        }
    }
}

export default AdminProtectedRoute
