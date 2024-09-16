import React, { createContext, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

const userReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload, isAuthenticated: true };
        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: true };
        default:
            return state;
    }
};

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, { user: null, isAuthenticated: false });

    useEffect(() => {
        const token = Cookies.get('token');
        const email = Cookies.get('email');
        const isAdmin = Cookies.get('isAdmin');
        
        if (token && email) {
            dispatch({
                type: 'SET_USER',
                payload: { token, email, isAdmin: isAdmin === 'true' },
            });
        }
    }, []);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
