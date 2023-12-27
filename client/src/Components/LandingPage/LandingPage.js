import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const location = useLocation();
  const { username } = location.state || {};
  const navigate = useNavigate();

  // function for when account settings button is clicked
  const onAccountSettingsClick = () => {
    navigate('/accountsettingspage', {state: {username}})
  }

  // function for when find a train button is clicked
  const onFindATrainClick = () => {
    navigate('/findatrainpage', {state: {username}})
  }

  // function for when find a station button is clicked
  const onFindAStationClick = () => {
    navigate('/findastationpage', {state: {username}})
  } 

  const onFavouriteClick = () => {
    navigate('/favourite', {state: {username}})
  }

  const onPurchaseTicketClick = () => {
    navigate('/purchaseaticketpage', {state: {username}})
  }

  // Define the background image URL
  const backgroundImageUrl =
    "https://images.squarespace-cdn.com/content/v1/5a5a32bface864067d391bd9/1558369778422-5S6QT5W466Q20JCDE1C4/redline_losangeles.jpeg";

  // Inline style for background image
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };
  
  const buttonStyle = "f4 link dim ph3 pv2 ma2 dib white bg-dark-blue"

  return (
    <div className="tc ma0 pa0 vh-100" style={backgroundStyle}>
      <div className="pa4 bg-white-30" style={{ color: 'rgb(128, 0, 0)' }}>
        <h1 className="f1">Welcome {username}</h1>
        <h1 className="f2">With this database application you can: add funds to your account, find a train connecting two stations, find stations along a route (train line), purchase a ticket, and check accessibility!</h1>
      </div>

      <div className="flex justify-center">
        <button onClick={onAccountSettingsClick} className="f4 link dim ph3 pv2 ma2 dib white bg-dark-blue" style={{ fontFamily: "sans-serif" }}>
          Account Settings
        </button>
        <button onClick={onFindATrainClick} className="f4 link dim ph3 pv2 ma2 dib white bg-dark-blue" style={{ fontFamily: "sans-serif" }}>
          Find a Train
        </button>
        <button onClick={onFindAStationClick} className="f4 link dim ph3 pv2 ma2 dib white bg-dark-blue" style={{ fontFamily: "sans-serif" }}>
          Find a Station
        </button>
        <button onClick={onPurchaseTicketClick} className="f4 link dim ph3 pv2 ma2 dib white bg-dark-blue" style={{ fontFamily: "sans-serif" }}>
          Purchase a Ticket
        </button>
        <button onClick={onFavouriteClick} className="f4 link dim ph3 pv2 ma2 dib white bg-dark-blue" style={{ fontFamily: "sans-serif" }}>
          Manage Favourites
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
