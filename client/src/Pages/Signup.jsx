import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import UserContext from '../context/UserContext';
import MobileSplash from '../Assets/mobilesplash.jpg';


const SignUp = () => {
    const { dispatch } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [year, setYear] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else {
            setOtpSent(false); // Enable resend OTP button when countdown ends
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleSignUp = async () => {
        try {
            const res = await axios.post('https://code-box-backend.vercel.app/api/auth/signup', { 
                email, 
                password, 
                department, 
                year 
            });
            alert(res.data.message);
            setOtpSent(true);
            setStep(2);
            setCountdown(600); // 10 minutes countdown (600 seconds)
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const res = await axios.post('https://code-box-backend.vercel.app/api/auth/verify-otp', { email, otp });
            alert(res.data.message);
            dispatch({ type: 'SET_USER', payload: { email, isAdmin: false } });
            navigate('/'); // Redirect to home page
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const handleResendOTP = async () => {
        try {
            const res = await axios.post('https://code-box-backend.vercel.app/api/auth/resend-otp', { email });
            alert(res.data.message);
            setCountdown(600); // Reset countdown
            setOtpSent(true);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const formatCountdown = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
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
                    <h3>Signup</h3>
                    <hr />
                </div>
                <div className="signup-container">
                {step === 1 ? (
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                        <button onClick={handleSignUp}>Sign Up</button>
                    </div>
                ) : (
                    <div>
                        <h2>Verify OTP</h2>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button onClick={handleVerifyOTP}>Verify OTP</button>
                        <button onClick={handleResendOTP} disabled={!otpSent || countdown > 0}>Resend OTP</button>
                        {countdown > 0 && <p>OTP valid for: {formatCountdown(countdown)}</p>}
                    </div>
                )}
                </div>
                <hr />
                <p onClick={() => navigate('/signup')}>Already have an Account?</p>
            </div>
        </div>
        
    );
};

export default SignUp;