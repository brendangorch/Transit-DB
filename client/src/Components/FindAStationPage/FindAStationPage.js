import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from "react";
import axios from 'axios';
import './FindAStationPage.css'

const FindAStationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state || {};
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setRoute] = useState("");
    const [stations, setStations] = useState([]);

    useEffect(() => {
        // fetch route names from backend
        axios.get('http://localhost:3005/api/getallroutes')
          .then(response => {
            const routeNames = response.data.routes.map(route => route.route_name);
            setRoutes(routeNames);
            console.log(routeNames);
          })
          .catch(error => {
            console.error('Error fetching station names:', error);
          });
      }, []);

    // function for when back is clicked
    const onBackClick = () => {
        navigate('/landingpage', {state: {username}})
    }

    // function for when search is clicked
    const onSearchClick = async () => {
        if (selectedRoute) {
            try {
                // call the backend function to get stations on a route
                const res = await axios.post('http://localhost:3005/api/findastation', {
                    routeName: selectedRoute
                });

                const fetchedStations = res.data.stations;
                setStations(fetchedStations);
            } catch (error) {
                console.log("Error:", error);
            }
        } else {
            alert("Please select a route.")
        }
    }

    return (
        <div className="a_vstack" style={{ backgroundColor: "#E7F1FB", minHeight: "100vh"}}>
            <div>
                <h1 className="f1"> Find all Stations on a Route </h1>
            </div>

            <div className="mb3 f4"> 
                <select
                id='select_route' name='Choose A Route'
                    value={selectedRoute}
                    onChange={(e) => setRoute(e.target.value)}
                    >
                    <option value="">Select Route</option>
                    {routes.map((route, index) => (
                        <option key={index} value={route}>
                        {route}
                        </option>
                    ))}
                </select>
                    
            </div>

            <div className="mb3 f3">
                <button className={`w-100`} onClick={onSearchClick}>Search</button>
            </div>

            {/* Display fetched stations */}
                {stations.length > 0 && (
                        <div>
                            <h1 className='f2 tc'>Stations:</h1>
                            
                                {stations.map((station, index) => (
                                    <div className="pa3 ba bg-light-blue mb3">
                                        <h3>Station Name: {station.station_name}</h3>
                                        <h3>Station Address: {station.station_address}</h3>
                                        <h3>Accessibility: {station.accessibility === 1 ? 'Yes' : 'No'}</h3>
                                        <h3>Amenities: {station.amenities === 1 ? 'Yes' : 'No'}</h3>
                                        <br></br><br></br>
                                    </div>
                                    
                                ))}
                            
                        </div>
                    )}


            <div className="a_anchorbot mb3">
                <button className={`w-100`} onClick={onBackClick}>Back</button>
            </div>
            
        </div>

            
    );
  };
  
  export default FindAStationPage;