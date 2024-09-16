import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import UserIcon from '../Assets/user.png';
import Coin from '../Assets/Coin.png';
import Cookies from 'js-cookie';
import UserContext from '../context/UserContext';

const Navbar = ({ email, isAdmin }) => {
    const userName = email ? email.split('@')[0] : 'User';
    const navigate = useNavigate();
    const { dispatch } = useContext(UserContext); 

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('email');
        Cookies.remove('isAdmin');
        
        dispatch({ type: 'LOGOUT' });
        
        console.log("Logout Success");
        navigate('/');
    };

    return (
        <nav className='mainNav'>
            <div className='leftNav'>
                <img className='userIcon' src={UserIcon} alt="User Icon" />
                <div>
                    <p>Welcome,</p>
                    <h3>{userName}</h3>
                </div>
            </div>
            <div className='rightNav'>
                {/* <img src={Coin} alt="Coin Icon" />
                <p>3500</p> */}
                {isAdmin && <span className="admin-badge">Admin</span>}
            </div>
            {email ? <button onClick={handleLogout}>Logout</button> : <p>Hi</p>}
        </nav>
    );
}

export default Navbar;
