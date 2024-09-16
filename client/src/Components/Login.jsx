import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import MobileSplash from '../Assets/mobilesplash.jpg';
import UserContext from '../context/UserContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { dispatch } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const { token, isAdmin } = res.data;
            console.log(token, isAdmin)
            // Set the token, email, and isAdmin in cookies
            Cookies.set('token', token, { expires: 1, sameSite: 'Strict' }); // Store token in cookies
            Cookies.set('email', email, { expires: 1, sameSite: 'Strict' }); // Store email in cookies
            Cookies.set('isAdmin', isAdmin, { expires: 1, sameSite: 'Strict' }); // Store isAdmin status
            dispatch({ type: 'SET_USER', 
                payload: { 
                    token: token,
                    email: email,     
                    isAdmin: isAdmin, 
                }
            }); 

            console.log('Login Sucess');
            navigate('/home');
        } catch (error) {
            console.log('Login Failure');
            alert(error.response.data.message);
        }
    };

    return (
        <div className='loginContainer'>
            <div className='loginImage'>
                <img src={MobileSplash} alt="Mobile Splash" />
            </div>
            <div className='loginContent'>
                <h1>&lt;/&gt;</h1>
                <h2>CodeBox</h2>
                <div>
                    <hr />
                    <h3>Login</h3>
                    <hr />
                </div>
                <form onSubmit={handleLogin}>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type='submit'>Login</button>
                </form>
                <hr />
                <p onClick={() => navigate('/signup')}>Dont have an Account?</p>
            </div>
        </div>
    );
};

export default Login;
