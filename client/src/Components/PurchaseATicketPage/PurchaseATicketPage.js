import React, { useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const PurchaseATicketPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {username} = location.state || {};
    // create refs for the select elements
    const passengerTypeRef = useRef(null);
    const paymentMethodRef = useRef(null);
 
   
    // function for when back is clicked
    const onBackClick = () => {
        navigate('/landingpage', {state: {username}})
    };

    // function for when purchase ticket is clicked
    const onPurchaseClick = async () => {

        // get values of refs
        const passengerType = passengerTypeRef.current.value;
        const paymentMethod = paymentMethodRef.current.value;
        if (passengerType !== "none" && paymentMethod !== "none") {
            try {
                // get account number from backend
                const res1 = await axios.post('http://localhost:3005/api/getaccountdetails', {
                    username: username
                })

                const accountNum = res1.data.account_number;

                // call create ticket method from backend
                const res2 = await axios.post('http://localhost:3005/api/purchaseticket', {
                    accountNumber: accountNum,
                    passengerType: passengerType,
                    paymentMethod: paymentMethod
                });

                alert(res2.data.message);
            } catch (error) {
                console.log("Error:", error)
            }
        } else {
            alert("Please select a passenger type and payment method")
        }
    };

    return (
        <div className="a_vstack" style={{ backgroundColor: "#E7F1FB", minHeight: "100vh"}}>
            <div>
                <h1 className="f1">Purchase A Ticket</h1>
            </div>

            <div>
                <div>
                    <h3>Purchase Details</h3>
                </div>

                <div className="mb3 f4">
                    <label>Select Passenger Type:</label>
                    <select id='passenger_type'ref={passengerTypeRef} name='Select passenger type'>
                        <option value = 'none'>Select Passenger </option>
                        <option value="0">Child (0-14)</option>
                        <option value="1">Adult (14+)</option>
                    </select>
                </div>

                <div className="mb3 f4">
                    <label>Select Payment Method:</label>
                    <select id='payment_type' ref={paymentMethodRef} name='Select payment type'>
                        <option value='none'>Select Payment Type</option>
                        <option value='c'>Credit Card</option>
                        <option value='d'>Debit Card</option>
                        <option value='g'>Gift Card</option>
                        <option value='o'>Other</option>
                    </select>
                </div>

                <div className="tc mb3">
                    <button className={`w-100`}onClick={onPurchaseClick}>Purchase Ticket</button>
                </div>

                <div>
                    <button className={`w-100`} onClick={onBackClick}>Back</button>
                </div>

            </div>
        </div>
    );
  };
  
  export default PurchaseATicketPage;