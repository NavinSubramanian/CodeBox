import React, { useContext } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import UserContext from './context/UserContext';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const { state } = useContext(UserContext);
    const email = Cookies.get('email');

    return (
        email ? <Outlet/> : <Navigate to="/" />
    );
};

export default PrivateRoute;