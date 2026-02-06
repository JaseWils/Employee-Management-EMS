
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
        }
    };

    const handleResendOtp = async () => {
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
        }
    };

    return (
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
            </div>
        </div>
    );
};

export default VerifyOTP;
