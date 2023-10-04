import React,{useState} from "react";
import './Premium.css'
import axios from "axios";


export default function Premium() {

    const [premiumprice, setPremiumprice] = useState(199);
    const handlepayment = async () => {
		try {

			// if(!localStorage.getItem("token")){
			// 	alert("You have not logged in.");
			// 	return navigate("/login");
			// }
            // console.log("Hanlde")
			const orderUrl = "http://localhost:8800/api/pay/orders";
			const { data } = await axios.post(
				orderUrl,
				{ amount: premiumprice },
				{
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
						'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Origin, Authorization',
					},
				}
			);
            console.log("2nd")
			console.log(data);
			initPayment(data.data);
		} catch (error) {
			console.log(error);
		}
	};
    const initPayment = (data) => {
        console.log("In init")
        const options = {
          key: "rzp_test_zkRk5Km3mrtYWp",
          amount: data.amount,
          currency: data.currency,
          description: "Test Transaction",
          order_id: data.id,
          handler: async (response) => {
            try {
              const verifyUrl = "http://localhost:8800/api/pay/verify";
              const { data } = await axios.post(verifyUrl, response, {
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
                  'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Origin, Authorization',
                },
              });
              console.log(data);
              if(data.status){
                alert("Purchased Premium Succesfully");
                //Update in DB
              }
            } catch (error) {
              console.log(error);
            }
          },
          theme: {
            color: "#3399cc",
          },
        };
    
        console.log(options)
        const rzp1 = new window.Razorpay(options);
    
    
        rzp1.open();
      };
 
    // #17a2b8
  return (
    <>
        <div className="premium_page">
            <div className="pre_heading">
                <h1>We scale with your needs</h1>
                <h4>Protect your company and brand with the following options</h4>
            </div>
            <div className="premium_flex">
                <div className="pre_flex1">
                    <div className="pre_head_flex">
                        Essentials 
                    </div>
                    <div className="pre_body">
                        <h3>Always free</h3>
                        <p>5 scans per day</p>
                        <p>150 scans per month</p>
                        <button className='pre_b1'>Register Today</button>
                    </div>
                </div>
                <div className="pre_flex1">
                    <div className="pre_head_flex">
                        Get Premium
                    </div>
                    <div className="pre_body">
                        <h3>₹350/Month only</h3>
                        <p>50 scans per day</p>
                        <p>1,500 scans per month</p>
                        <button onClick={handlepayment} className='pre_b2'>Purchase Now</button>
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
                        <button className='pre_b3'>Get Extension</button>
                    </div>
                </div>
            </div>
        </div>
    </>
 )


};



