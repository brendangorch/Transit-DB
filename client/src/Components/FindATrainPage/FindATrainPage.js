import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useLocation } from "react-router-dom";

const FindATrainPage = () => {
  const navigate = useNavigate();
  const [departFrom, setDepartFrom] = useState("");
  const [arriveAt, setArriveAt] = useState("");
  const [stations, setStations] = useState([]);
  const [searchResult, setSearchResult] = useState(""); // Variable for search result
  const location = useLocation()
  const {username} = location.state || {};

  const onBackClick = () => {
    navigate("/landingpage", {state: {username}});
  };

  const onSearchClick = () => {
    if (!departFrom || !arriveAt) {
      alert("Please select both departure and arrival stations.");
      return;
    }

    // Call to the backend API
    axios.post('http://localhost:3005/api/findtrain', { departFrom, arriveAt })
      .then(response => {
        const result = response.data;
        if (result.Results && result.Results.length > 0) {
            const trainInfo = result.Results[0];
            const arrivalTime = new Date(trainInfo.station_a_arrival).toLocaleString();
            setSearchResult(`${result.message} The train you need to take is ${trainInfo.tn1}, which arrives at ${arrivalTime}`);
        } else {
          setSearchResult("No train found for the selected stations.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        setSearchResult("Error fetching train details");
      });
  };

  useEffect(() => {
    axios.get('http://localhost:3005/api/getallstations')
      .then(response => {
        const stationNames = response.data.Results.map(station => station.station_number);
        setStations(stationNames);
      })
      .catch(error => {
        console.error('Error fetching station names:', error);
      });
  }, []);

  return (
        <div className="a_vstack" style={{ backgroundColor: "#E7F1FB", minHeight: "100vh"}}>
          <div>
            <h1 className="f1"> Find a Train </h1>
          </div>

          <div className="mb3 f4">
            <h3>Depart From Station:</h3>
            <select
            value={departFrom}
            onChange={(e) => setDepartFrom(e.target.value)}
            >
            <option value="">Select Departure Station</option>
            {stations.map((station, index) => (
                <option key={index} value={station}>
                {station}
                </option>
            ))}
            </select>
        </div>

        <div className="mb3 f4">    
            <h3>Arrive at Station:</h3>
            <select
            value={arriveAt}
            onChange={(e) => setArriveAt(e.target.value)}
            >
            <option value="">Select Arrival Station</option>
            {stations.map((station, index) => (
                <option key={index} value={station}>
                {station}
                </option>
            ))}
            </select>
        </div>

        <div className="mb3 f3">
            <button onClick={onSearchClick}>Search</button>
        </div>

        <div className="a_anchorbot mb3">
                <button className={`w-100`} onClick={onBackClick}>Back</button>
            </div>
        {searchResult && (
            <div className="search-result">
            <h2>{searchResult}</h2>
            </div>
        )}
    </div>
  );
};

export default FindATrainPage;
