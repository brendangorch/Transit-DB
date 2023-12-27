import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from "react";
import { useRef } from "react";
import axios from 'axios';
import './AccountSettingsPage.css'

const AccountSettingsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state || {};
    const fundsRef = useRef();
    const [accountDetails, setAccountDetails] = useState({
        accountNumber: '',
        birthday: '',
        funds: ''
    });

    // function for when add funds is clicked
    const onAddFundsClick = async () => {
        const funds = fundsRef.current.value;
        
        if (funds) {
            try {
                const res = await axios.post('http://localhost:3005/api/addfundstowallet', {
                    username: username,
                    amount: funds
                })

                alert(res.data.message)

                window.location.reload();

            } catch (error) {
                console.log("Error:", error);
            }
            
        } else {
            alert("Enter an amount to add.")
        }
    };

    const buttonStyle = "f4 link dim ph3 pv2 ma2 dib white bg-dark-blue";

    useEffect(() => {
        // fetch account details when the component mounts
        axios.post('http://localhost:3005/api/getaccountdetails', { username })
            .then(response => {
                const { account_number, date_of_birth, funds } = response.data;
    
                setAccountDetails({
                    accountNumber: account_number,
                    birthday: date_of_birth,
                    funds: funds
                });
            })
            .catch(error => {
                console.error('Error fetching account details:', error);
            });
    }, [username]);

    // function for when back is clicked
    const onBackClick = () => {
        navigate('/landingpage', {state: {username}})
    }

    const backgroundImageUrl =
    "https://images.squarespace-cdn.com/content/v1/5a5a32bface864067d391bd9/1558369778422-5S6QT5W466Q20JCDE1C4/redline_losangeles.jpeg";

    const backgroundStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    };

    return (
        <div className="tc ma0 pa0 vh-100" style={backgroundStyle}>
          <div className="pa4 bg-white-30" style={{ color: "rgb(128, 0, 0)" }}>
            <h1 className="f1">Account Details</h1>
          </div>
    
          {/* Account Details Container */}
          <div className="pa4 bg-white-70">
            <div className="flex flex-column">
              <p className="mb1 f3">
                Username: {username}
              </p>
              {/* Add other account details here */}
              <p className="mb1 f3">Account Number: {accountDetails.accountNumber}</p>
              <p className="mb1 f3">Birthday: {accountDetails.birthday}</p>
              <p className="mb1 f3">Funds: {accountDetails.funds}</p>
            </div>
          </div>
    
          {/* Add Funds Container */}
          <div className="pa4 bg-white-70">
            <h2 className="f2 mb3">Enter amount (max 3 digits)</h2>
            <div className="flex flex-column items-center">
              <label htmlFor="amountToAdd" className="f3">Amount to Add:</label>
              <input
                type="number"
                id="amountToAdd"
                ref = {fundsRef}
                className="mb2 f4 w-30"
              />
              <button
                onClick={onAddFundsClick}
                className={`${buttonStyle} w-30`}
                style={{ fontFamily: "sans-serif" }}
              >
                Add
              </button>
            </div>
          </div>
    
          {/* Navigation Buttons */}
          <div className="flex justify-center mt4">
            <button
              onClick={onBackClick}
              className={buttonStyle}
              style={{ fontFamily: "sans-serif" }}
            >
              Back
            </button>
          </div>
        </div>
      );
  };
  
  export default AccountSettingsPage;