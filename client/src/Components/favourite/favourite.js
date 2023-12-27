import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const Favourite = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { username } = location.state || {};
    const [favoriteStations, setFavoriteStations] = useState([]);
    const [favoriteRoutes, setFavoriteRoutes] = useState([]);
    const [newStation, setNewStation] = useState('');
    const [newRoute, setNewRoute] = useState('');

    const onBackClick = () => {
        navigate("/landingpage", {state: {username}});
    };

    const addFavoriteStation = async () => {
        if (!newStation.trim()) {
            alert("Please enter a valid station number.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3005/api/addfavstation', { 
                username: username, 
                station_num: newStation
            });
            if (response.data.Results) {
                alert("Station added successfully.");
            } else {
                alert("Station added, but no results returned");
            }
        } catch (error) {
            alert("Station number not found.");
        } finally {
            window.location.reload();
        }
    };

    const addFavoriteRoute = async () => {
        if (!newRoute.trim()) {
            alert("Please enter a valid route number.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3005/api/addfavroute', { 
                username: username, 
                route_num: newRoute
            });
            if (response.data.Results) {
                alert("Route added successfully.");
            } else {
                alert("Route added, but no results returned.");
            }
        } catch (error) {
            alert("Route number not found.");
        } finally {
            window.location.reload();
        }
    };

    useEffect(() => {
        if (username) {
            // Fetch favorite stations
            axios.post('http://localhost:3005/api/getfavouritestation', { username })
                .then(response => {
                    if (response.data.Results) {
                        setFavoriteStations(response.data.Results);
                    }
                })
                .catch(error => {
                    console.error('Error fetching favorite stations:');
                });

            // Fetch favorite routes
            axios.post('http://localhost:3005/api/getfavouriteroute', { username })
                .then(response => {
                    if (response.data.Results) {
                        setFavoriteRoutes(response.data.Results);
                    }
                })
                .catch(error => {
                    console.error('Error fetching favorite routes:');
                });
        }
    }, [username]);

    return(
        <div className="a_vstack" style={{ backgroundColor: "#E7F1FB", minHeight: "100vh"}}>
            <div>
                <h1 className="f1"> Manage your Favourite Stations and Routes</h1>
            </div>
            <div className="mb3 f4">
                <h2>Favorite Stations:</h2>
            </div>
            <ul>
                <div className="f3">   
                {favoriteStations.map((station, index) => (
                    <li key={index}>Station Number: {station.station_number}</li>
                ))}
                </div>
            </ul>
            <div>
                <input 
                    type="number" 
                    value={newStation} 
                    onChange={(e) => setNewStation(e.target.value)} 
                    placeholder="Enter Station Number"
                />
                <button onClick={addFavoriteStation}>Add</button>
            </div>
            <div className="mb3 f4">
                <h2>Favorite Routes:</h2>
            </div>
            <ul>
                <div className="f3">
                {favoriteRoutes.map((route, index) => (
                    <li key={index}>Route Number: {route.route_number}</li>
                ))}
                </div>
            </ul>
            <div>
                <input 
                    type="number" 
                    value={newRoute} 
                    onChange={(e) => setNewRoute(e.target.value)} 
                    placeholder="Enter Route Number"
                />
                <button onClick={addFavoriteRoute}>Add</button>
            </div>
            <br></br>
            <br></br>
            <div className="tc a_anchorbot mb3">
                <button onClick={onBackClick}>Back</button>
            </div>
        </div>
    )
}

export default Favourite;
