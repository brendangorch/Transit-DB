const express = require('express'); // require express
const app = express();
const mysql = require('mysql'); // require mysql
const cors = require('cors');

app.use(express.json());

const port = process.env.PORT || 3005;

app.use(cors());

// middleware to parse JSON request bodies
app.use(express.json()); 

// middleware for logging for all routes
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Create a connection to the database
const db = mysql.createConnection({
    // connection information for MySQL (varies based on who is using the application)
    // enter your details before trying to run the app
    host: '',
    user: '',
    password: '',
    database: 'transit'
});


// connect to the database
db.connect((err) => {
    if(err) {
        throw err;
    }
   
    console.log('MySQL Database connected...');

});



// login post method
app.post('/api/login', (req, res) => {
    try {
        // get the username and password from the request body
        const { username, password } = req.body;

        // create the query for logging in
        const loginQuery = `
            SELECT * 
            FROM useraccount 
            WHERE username = ? AND passwurd = ?;
        `;

       // execute the query with parameters
        db.query(loginQuery, [username, password], (err, results) => {
            if (err) {
                console.log("Database error:", err);
                return res.status(500).json({ error: 'DB Error.' });
            }

            // check if any user matches the provided credentials
            if (results.length > 0) {

                // successful login
                return res.status(200).json({ message: 'Login successful.' });
            } else {
                // invalid credentials
                return res.status(200).json({ message: 'Invalid username or password.'});
            }
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json( {error: 'Internal Server Error.'});
    }
});

// Add funds to account 
app.post('/api/addfundstowallet', (req, res) => {
    try {
        // get the username and amount to add from the front end
        const { username, amount } = req.body;
        
        // create the query for adding funds to an account
        const updateQuery = `
            UPDATE useraccount
            SET funds = funds + ?
            WHERE username = ?;
        `;

        // execute the query
        db.query(updateQuery, [amount, username], (queryErr, results) => {
            if (queryErr) {
                console.log("Error:", queryErr);
                return res.status(500).json({ error: 'Database error' });
            }

            // log the results
            console.log('Query results:', results);

            return res.status(200).json({ message: `$${amount} added successfully to your account.` });
        });


    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json( {error: 'Account Number not found'});
    }
     
})

// post function to get account details from username
app.post('/api/getaccountdetails', (req, res) => {
    try {
        const { username } = req.body;

        // create query for getting account details
        const getAccountDetailsQuery = `
            SELECT * 
            FROM useraccount
            WHERE username = ?; 
        `;

        // execute the query
        db.query(getAccountDetailsQuery, [username], (queryErr, results) => {
            if (queryErr) {
                console.log("Error:", queryErr);
                return res.status(500).json({ error: 'Database error' });
            }

            
            // log the results
            console.log('Query results:', results);

            const { account_number, date_of_birth, funds} = results[0] || {};
            console.log(account_number)

            return res.status(200).json({ message: `Account details fetched sucessfully.`, account_number: account_number,
                    date_of_birth: date_of_birth, funds: funds });
        });


    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json( {error: 'Account Number not found'});
    }
});

// get method for returning all route names (limited to 50 for the purpose of this assignment)
app.get('/api/getallroutes', (req, res) => {
    try {
        // create the query
        const getRoutesQuery = `
            SELECT route_name
            FROM route
            LIMIT 50;
        `;

        // execute the query
        db.query(getRoutesQuery, (queryErr, results) => {
            if (queryErr) {
                console.log("Error:", queryErr);
                return res.status(500).json({ error: 'Database error' });
            }

            // log the results
            console.log('Query results:', results);

            // send the routes
            return res.status(200).json({ message: `Routes fetched sucessfully.`, routes: results});
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json( {error: 'Internal Server Error'});
    }

});

// post method to find a train by route name
app.post('/api/findastation', (req, res) => {
    try {
        // get the route name entered in the body
        const { routeName } = req.body;

       // create the query
       const findStationQuery = `
            SELECT station.*
            FROM route
            JOIN routeStation ON Route.route_number = routeStation.route_number
            JOIN station ON routeStation.station_number = station.station_number
            WHERE route.route_name = ?
            ORDER BY station.station_number
        `;

        // execute the query
        db.query(findStationQuery, [routeName], (queryErr, results) => {
            if (queryErr) {
                console.log("Error:", queryErr);
                return res.status(500).json({ error: 'Database error' });
            }
            
            // log the results
            console.log('Query results:', results);

            return res.status(200).json({ message: `Stations fetched.`, stations: results});
        });

        
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json( {error: 'Internal Server Error'});
    }
});

// GET method to return the first 25 
app.get('/api/getallstations', (req, res) => {
    try{
        // create query for getting account details
        const getStationsQuery = `
        SELECT station_number 
        FROM Station
        LIMIT 50; 
        `;

        // execute the query
        db.query(getStationsQuery, (queryErr, results) => {
            if (queryErr) {
                console.log("Error:", queryErr);
                return res.status(500).json({ error: 'Database error' });
            }

            // log the results
            console.log('Query results:', results);
            

            return res.status(200).json({ message: `Stations fetched sucessfully.`, Results: results});
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json( {error: 'Account Number not found'});
    }
})

// post method to find a train between two stations
app.post('/api/findtrain', (req, res) => {
    try {

        // get the route name entered in the body
        const { departFrom, arriveAt } = req.body;

       // create the query
       const findTrainQuery = `
       SELECT tn1, tn2, sid1, sid2, arrival_time as station_a_arrival, departure_time as station_a_departure
       FROM (select tn1, tn2, sid1, sid2
               FROM (
                   SELECT a.train_number as tn1, a.station_number as sn1, a.schedule_id as sid1, b.train_number as tn2, b.station_number as sn2, b.schedule_id as sid2
                   FROM trainstationschedule a, trainstationschedule b
                   WHERE a.station_number = ? && b.station_number = ?
                   ) as t  
       WHERE tn1 = tn2 and sid1 < sid2) as t1 JOIN schedules on sid1=schedule_id
       `;

        // execute the query
        db.query(findTrainQuery, [departFrom, arriveAt], (queryErr, results) => {
            if (queryErr) {
                console.log("Error:", queryErr);
                return res.status(500).json({ error: 'Database error' });
            }

        
            console.log('Query results:', results);
            return res.status(200).json({ message: `Train fetched sucessfully.`, Results: results});
        });

        
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json( {error: 'Internal Server Error'});
    }
});


// post method to purchase a ticket
app.post('/api/purchaseticket', async (req, res) => {
    try {
        const { accountNumber, passengerType, paymentMethod } = req.body;


        let cost = 0;
        var fundsInAccount = 0;

        // calculate cost of ticket
        if (passengerType == 0) {
            cost = 3.50;
        } else if (passengerType == 1) {
            cost = 5.0;
        }

        // create the query to get the user account
        const getAccountQuery = `
            SELECT * 
            FROM useraccount
            WHERE account_number = ?; 
        `;

        // execute the query using async/await
        const results = await new Promise((resolve, reject) => {
            db.query(getAccountQuery, [accountNumber], (queryErr, queryResults) => {
                if (queryErr) {
                    reject(queryErr);
                } else {
                    resolve(queryResults);
                }
            });
        });

        // get the funds in the account
        fundsInAccount = results[0].funds;

        // insufficient funds
        if (fundsInAccount < cost) {
            return res.status(200).json( {message: 'Insufficient Funds.'});
        }

        // query to create a ticket
        const createTicketQuery = `
            INSERT INTO Ticket (passenger_type, account_number, cost)
            VALUES (?, ?, ?);
            `;

        const getLastInsertedIdQuery = `
            SELECT LAST_INSERT_ID() AS ticket_id;
            `;

        // execute the query to create a ticket
        const ticketResults = await new Promise((resolve, reject) => {
            db.query(createTicketQuery, [passengerType, accountNumber, cost], (ticketErr, ticketQueryResults) => {
                if (ticketErr) {
                    reject(ticketErr);
                } else {
                    // execute the query to get the last inserted ticket_id
                    db.query(getLastInsertedIdQuery, (getIdErr, getIdResults) => {
                        if (getIdErr) {
                            reject(getIdErr);
                        } else {
                            const lastInsertedId = getIdResults[0].ticket_id;
                            resolve({ ticket: ticketQueryResults, lastInsertedId });
                        }
                    });
                }
            });
        });

        // get the ticket id
        const ticketId = ticketResults.lastInsertedId;
    
        // create query to add into PurchaseTicket relation table
        const purchaseTicketQuery = `
            INSERT INTO PurchaseTicket (account_number, ticket_id, transaction_id, payment_method)
            VALUES (?, ?, ?, ?);
            `;

        // execute the query to add into PurchaseTicket relation table
        await new Promise((resolve, reject) => {
            db.query(purchaseTicketQuery, [accountNumber, ticketId, 10000605
                , paymentMethod], (purchaseErr, purchaseResults) => {
                if (purchaseErr) {
                    reject(purchaseErr);
                } else {
                    resolve(purchaseResults);
                }
            });
        });

        // create query to subtract funds
        const updateFundsQuery = `
            UPDATE UserAccount
            SET funds = funds - ?
            WHERE account_number = ?`;
            
        // execute the query
        db.query(updateFundsQuery, [cost, accountNumber], (queryErr, results) => {
            if (queryErr) {
                console.log("Error:", queryErr);
                return res.status(500).json({ error: 'Database error' });
            }

            console.log('Query results:', results);
            return res.status(200).json({ message: `Ticket purchased successfully. $${cost} removed from account`});
        });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json( {error: 'Internal Server Error'});
    }
});

// Get users favouirte station
app.post('/api/getfavouritestation', (req, res) => {
    try{
        const { username } = req.body;

        // Get account number from user account
        const getAccountNumQuery = `
        SELECT account_number
        FROM UserAccount
        WHERE username = ?
        `;

        // Execute the first query
        db.query(getAccountNumQuery, [username], (queryErr, results) => {
            if (queryErr) {
                console.log("Error:", queryErr);
                return res.status(500).json({ error: 'Database error' });
            }

            // Check if account number is found
            if (results.length === 0) {
                return res.status(404).json({ error: 'Account Number not found' });
            }

            const account_num = results[0].account_number;

            // Get favourite route
            const getFavStationQuery = `
            SELECT *
            FROM favourite_station
            WHERE account_number = ?      
            `;


            // Execute the second query inside the first query's callback
            db.query(getFavStationQuery, [account_num], (queryErr, favResults) => {
                if (queryErr) {
                    console.log("Error:", queryErr);
                    return res.status(500).json({ error: 'Database error' });
                }

                // Log and return the results
                console.log('Favourite Station:', favResults);
                return res.status(200).json({ message: `Favourite Station fetched successfully.`, Results: favResults});
            });
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json( {error: 'Internal Server Error'});
    }
});

// Get users favouirte routes
app.post('/api/getfavouriteroute', (req, res) => {
    try{
        const { username } = req.body;

        // Get account number from user account
        const getAccountNumQuery = `
        SELECT account_number
        FROM UserAccount
        WHERE username = ?
        `;

        // Execute the first query
        db.query(getAccountNumQuery, [username], (queryErr, results) => {
            if (queryErr) {
                console.log("Error:", queryErr);
                return res.status(500).json({ error: 'Database error' });
            }

            // Check if account number is found
            if (results.length === 0) {
                return res.status(404).json({ error: 'Account Number not found' });
            }

            const account_num = results[0].account_number;

            // Get favourite route
            const getFavRouteQuery = `
            SELECT *
            FROM favourite_route
            WHERE account_number = ?
            `;


            // Execute the second query inside the first query's callback
            db.query(getFavRouteQuery, [account_num], (queryErr, favResults) => {
                if (queryErr) {
                    console.log("Error:", queryErr);
                    return res.status(500).json({ error: 'Database error' });
                }

                // Log and return the results
                console.log('Favourite Route:', favResults);
                return res.status(200).json({ message: `Favourite Route fetched successfully.`, Results: favResults});
            });
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json( {error: 'Internal Server Error'});
    }
});

// Add a favourite Station
app.post('/api/addfavstation', (req, res) => {
    try{
        const { username, station_num } = req.body;

        // Get account number from user account
        const getAccountNumQuery = `
            SELECT account_number
            FROM UserAccount
            WHERE username = ?
        `;

        // Execute the first query
        db.query(getAccountNumQuery, [username], (queryErr, results) => {
            if (queryErr) {
                console.log("Error:", queryErr);
                return res.status(500).json({ error: 'Database error' });
            }

            // Check if account number is found
            if (results.length === 0) {
                return res.status(404).json({ error: 'Account Number not found' });
            }

            const account_num = results[0].account_number;

            // Add the favourite station
            const addFavStationQuery = `
            INSERT INTO favourite_station
            VALUES (?, ?);
            `;

            // execute the query
            db.query(addFavStationQuery, [account_num, station_num], (queryErr, results) => {
                if (queryErr) {
                    console.log("Error:", queryErr);
                    return res.status(500).json({ error: 'Database error' });
                }

            
                console.log('Query results:', results);
                return res.status(200).json({ message: `Favourite Station added sucessfully.`, Results: results});
            });
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json( {error: 'Station number not found.'});
    }
})

// Add a favourite Route
app.post('/api/addfavroute', (req, res) => {
    try{
        const { username, route_num } = req.body;

        // Get account number from user account
        const getAccountNumQuery = `
            SELECT account_number
            FROM UserAccount
            WHERE username = ?
        `;

        // Execute the first query
        db.query(getAccountNumQuery, [username], (queryErr, results) => {
            if (queryErr) {
                console.log("Error:", queryErr);
                return res.status(500).json({ error: 'Database error' });
            }

            // Check if account number is found
            if (results.length === 0) {
                return res.status(404).json({ error: 'Account Number not found' });
            }

            const account_num = results[0].account_number;

            // Add the favourite station
            const addFavRouteQuery = `
            INSERT INTO favourite_route
            VALUES (?, ?)
            `;

            // execute the query
            db.query(addFavRouteQuery, [account_num, route_num], (queryErr, results) => {
                if (queryErr) {
                    console.log("Error:", queryErr);
                    return res.status(500).json({ error: 'Database error' });
                }

            
                console.log('Query results:', results);
                return res.status(200).json({ message: `Favourite Route added sucessfully.`, Results: results});
            });
        });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json( {error: 'Route number not found.'});
    }
})


app.listen(port, () => console.log(`Listening on port ${port}...`));