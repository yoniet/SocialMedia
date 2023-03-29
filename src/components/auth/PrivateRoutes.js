import React, { ComponentElement } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom'
import EditProfile from '../users/EditProfile';
import { auth } from './auth-helper';



const PrivateRoutes = () => {
    let authToken = auth.isAuthenticated() ? true : false
    return authToken ? <Outlet /> : <Navigate to="/signin" />
}

export default PrivateRoutes;