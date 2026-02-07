<<<<<<< HEAD
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './VerifyOTP.css';

const VerifyOTP = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            navigate('/signup');
        }
    }, [navigate]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        
        if (otpString.length !== 6) {
            toast.error('Please enter complete OTP');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/verify-otp`,
                { email, otp: otpString }
            );

            if (response.data.success) {
                toast.success('Email verified successfully!');
                localStorage.removeItem('userEmail');
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
=======

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const VerifyOTP = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    useEffect(() => {
        // Retrieve email from localStorage
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const URL = process.env.REACT_APP_BACKEND_URL;
            const response = await axios.post(`${URL}/verify-otp`, { email, otp });

            if (response.data.success) {
                toast.success(response.data.message, {
                    duration: 2000,
                    position: 'top-center',
                    icon: '👏',
                });
                // Redirect to login or home page
            } else {
                toast.error(response.data.message, {
                    duration: 2000,
                    position: 'top-center',
                    icon: '❌',
                });
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            toast.error('An error occurred during OTP verification.', {
                duration: 2000,
                position: 'top-center',
                icon: '❌',
            });
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        }
    };

    const handleResendOtp = async () => {
<<<<<<< HEAD
        if (countdown > 0) return;
        
        setResending(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/v1/resend-otp`,
                { email }
            );

            if (response.data.success) {
                toast.success('OTP resent successfully!');
                setCountdown(60);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResending(false);
=======
        try {
            const URL = process.env.REACT_APP_BACKEND_URL;
            const response = await axios.post(`${URL}/resend-otp`, { email });

            if (response.data.success) {
                toast.success(response.data.message, {
                    duration: 2000,
                    position: 'top-center',
                    icon: '👏',
                });
            } else {
                toast.error(response.data.message, {
                    duration: 2000,
                    position: 'top-center',
                    icon: '❌',
                });
            }
        } catch (error) {
            console.error('Error during OTP resend:', error);
            toast.error('An error occurred while resending OTP.', {
                duration: 2000,
                position: 'top-center',
                icon: '❌',
            });
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
        }
    };

    return (
<<<<<<< HEAD
        <div className="verify-container">
            <div className="verify-card">
                <div className="verify-icon">
                    <i className="fa fa-envelope-open-text"></i>
                </div>
                <h2>Verify Your Email</h2>
                <p>We've sent a 6-digit code to</p>
                <p className="email-display">{email}</p>

                <form onSubmit={handleSubmit} className="otp-form">
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="otp-input"
                            />
                        ))}
                    </div>

                    <button type="submit" className="btn-verify" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>

                <div className="resend-section">
                    <p>Didn't receive the code?</p>
                    <button 
                        onClick={handleResendOtp} 
                        disabled={countdown > 0 || resending}
                        className="btn-resend"
                    >
                        {countdown > 0 ? `Resend in ${countdown}s` : resending ? 'Sending...' : 'Resend OTP'}
                    </button>
                </div>
=======
        <div className='stylishBG d-flex justify-content-center align-items-center flex-column' style={{ height: '100vh' }}>
            <Toaster />
            <div className="form-container">
                <p className="title">Verify OTP</p>
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="input"
                        placeholder="Email"
                        value={email}
                        readOnly
                    />
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button type="submit" className="form-btn">Verify OTP</button>
                    <button type="button" className="form-btn" onClick={handleResendOtp}>Resend OTP</button>
                </form>
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
            </div>
        </div>
    );
};

<<<<<<< HEAD
export default VerifyOTP;
=======
export default VerifyOTP;
>>>>>>> 2b6bd551d067825577aa0957dbf4462a2172534d
