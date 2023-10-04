import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Login.css';

import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';

import axios from 'axios';

const Login = () => {
    const { isLoggedIn, userr, checkUserLoggedIn, handleLogout } = useContext(UserContext);

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [email1, setEmail1] = useState("");
    const [password1, setPassword1] = useState("");
    const [phone1, setPhone1] = useState("");
    const [name1, setName1] = useState("");

    // Register action
    const handleClick1 = async (e) => {
        e.preventDefault();
        if (!validateEmail(email1)) {
            alert('Invalid email address');
            return;
        }
        if (!validatePassword(password1)) {
            alert('Password too weak. Try again.');
            return;
        }
        if (!name1 || !phone1) {
            alert('Please fill all the fields first.');
            return;
        }

        const formData = {
            email: email1,
            name: name1,
            phone: phone1,
            password: password1
        }
        console.log(formData)

        try {
            const response = await axios.post('http://localhost:8800/api/auth/register', formData);
            console.log(response.data);
            console.log("Register succesful")
            navigate("/");
        } catch (error) {
            console.error(error.response);
        }
    };

    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordPattern.test(password);
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    // Login action
    const handleClick = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please fill all the fields first.');
            return;
        }
        const formData = {
            email: email,
            password: password
        }

        try {
            const response = await axios.post('http://localhost:8800/api/auth/login', formData, {
                withCredentials: true,
                credentials: "include",
            });
            checkUserLoggedIn();
            console.log("Login succesful");
            navigate("/");
        } catch (error) {
            console.error(error.response);
        }
    };

    const [containerClass, setContainerClass] = useState('');

    const handleRegisterClick = () => {
        setContainerClass('active');
    };

    const handleLoginClick = () => {
        setContainerClass('close');
    };


    return (
        <>
            <div id="LoginReg" className={containerClass}>
                <div className="Login">
                    <div className="content">
                        <h1>Log In</h1>
                        <label className="inp" htmlFor="usernameInput">
                            <input placeholder="Enter your email" id="usernameInput" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <span className="label">Email</span>
                            <span className="focus-bg"></span>
                        </label>
                        <label className="inp" htmlFor="passwordInput">
                            <input placeholder="Enter your password" id="passwordInput" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <span className="label">Password</span>
                            <span className="focus-bg"></span>
                        </label>
                        <input className="LoginBtn" type="button" onClick={handleClick} value="Sign In" />
                    </div>
                </div>

                <div className="page front">
                    <div className="content">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="96"
                            height="96"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-user-plus"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                        <h1>Welcome Back!</h1>
                        <p>To stay connected with us, please log in with your personal info</p>
                        <button type="button" id="register" onClick={handleRegisterClick}>
                            Login
                        </button>
                    </div>
                </div>

                <div className="page back">
                    <div className="content">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="96"
                            height="96"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-log-in"
                        >
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        <h1>Hello !</h1>
                        <p>Enter your personal details and start the journey with us.</p>
                        <button type="button" id="login" onClick={handleLoginClick}>
                            Register
                        </button>
                    </div>
                </div>

                <div className="Register">
                    <div className="content">
                        <h1>Sign Up</h1>
                        <label className="inp" htmlFor="emailInput">
                            <input placeholder="Enter your email" id="emailInput" type="email" value={email1} onChange={(e) => setEmail1(e.target.value)} />
                            {/* <span className="label">Email</span> */}
                            <span className="focus-bg"></span>
                        </label>
                        <label className="inp" htmlFor="nameInput">
                            <input placeholder="Enter your name" id="nameInput" type="text" value={name1} onChange={(e) => setName1(e.target.value)} />
                            {/* <span className="label">Name</span> */}
                            <span className="focus-bg"></span>
                        </label>
                        <label className="inp" htmlFor="phoneInput">
                            <input placeholder="Enter your phone number" id="phoneInput" type="text" value={phone1} onChange={(e) => setPhone1(e.target.value)} />
                            {/* <span className="label">Phone Number</span> */}
                            <span className="focus-bg"></span>
                        </label>
                        <label className="inp" htmlFor="passwordInput">
                            <input placeholder="Enter your password" id="passwordInput" type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} />
                            {/* <span className="label">Password</span> */}
                            <span className="focus-bg"></span>
                        </label>
                        <input className="LoginBtn" type="button" onClick={handleClick1} value="Sign Up" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;