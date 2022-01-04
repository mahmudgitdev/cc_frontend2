import React from 'react'
import {Navigate,useLocation,Outlet} from 'react-router-dom'
export default function ProtectedRoute() {
    let location = useLocation();
    let token = localStorage.getItem('token');
    if(!token) return <Navigate to="/auth/login" state={{ from: location }} />;
    return <Outlet />;
}
