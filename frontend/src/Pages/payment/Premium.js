import React, { useState, useContext } from "react";
import { UserContext } from '../../context/UserContext';
import "./Premium.css";
import axios from "axios";

export default function Premium() {
    const { isLoggedIn, userr, checkUserLoggedIn } = useContext(UserContext);

    const gradientColors = [
        "#67E0DD",
        "#A6D8DF",
        "#C5E8E2",
        "#94BBDF",
        "#DBDAE0",
        "#FAE8E1",
    ];

    const gradientStyle = {
        background: `linear-gradient(to right, ${gradientColors.join(",")})`,
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const [premiumprice, setPremiumprice] = useState(350);
    const handlepayment = async () => {
        try {
            if (!isLoggedIn) {
                alert("You are not logged in.");
                return;
                // return navigate("/login");
            }
            if (userr.isPremium) {
                alert('Premium is already there');
                return;
            }

            const orderApi = "http://localhost:8800/api/pay/orders";
            const { data } = await axios.post(
                orderApi,
                { amount: premiumprice },
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods":
                            "POST, GET, OPTIONS, PUT, DELETE",
                        "Access-Control-Allow-Headers":
                            "Content-Type, X-Auth-Token, Origin, Authorization",
                    },
                }
            );
            console.log(data);
            initPayment(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const initPayment = (data) => {
        console.log("In init")
        const options = {
            key: "rzp_test_Uf8e5ZC0BrgIFH",
            amount: data.amount,
            currency: data.currency,
            description: "Test Transaction",
            order_id: data.id,
            handler: async (response) => {
                try {
                    const verifyApi = "http://localhost:8800/api/pay/verify";
                    const { data } = await axios.post(verifyApi, { ...response, userId: userr._id }, {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
                            'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Origin, Authorization',
                        },
                    });
                    console.log(data);
                    if (data.status) {
                        alert("Purchased Premium Succesfully");
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#f57e42",
            },
        };

        console.log(options)
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    // #17a2b8
    return (
        <div style={gradientStyle}>
            <div className="premium_page">
                <div className="pre_heading">
                    <h1>We scale with your needs</h1>
                    <h4>
                        Protect your company and brand with the following
                        options {userr.isPremium}
                    </h4>
                </div>
                <div className="premium_flex">
                    <div className="pre_flex1">
                        <div className="pre_head_flex">Essentials</div>
                        <div className="pre_body">
                            <h3>Always free</h3>
                            <p>5 scans per day</p>
                            <p>150 scans per month</p>
                            <button className="pre_b1">Register Today</button>
                        </div>
                    </div>
                    <div className="pre_flex1">
                        <div className="pre_head_flex">Get Premium</div>
                        <div className="pre_body">
                            <h3>₹350/Month only</h3>
                            <p>50 scans per day</p>
                            <p>1,500 scans per month</p>
                            <button onClick={handlepayment} className="pre_b2">
                                Purchase Now
                            </button>
                        </div>
                    </div>
                    <div className="pre_flex1">
                        <div className="pre_head_flex">
                            Get Chrome Extension
                        </div>
                        <div className="pre_body">
                            <h3>Surf with Security!</h3>
                            <p>Scan websites </p>
                            <p>Chrome Extension</p>
                            <button className="pre_b3">Get Extension</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
