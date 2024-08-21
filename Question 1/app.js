const express = require('express');
const app = express();
app.use(express.json()); 
require('dotenv').config(); // Load environment variables from a .env file

let windowPrevState = []; // Array to store the previous window state
let windowCurrState = []; // Array to store the current window state
let windowSize = 10; // Size of the sliding window

// To run the server on port 5000
app.get(`/numbers/:numbers_type`, async (req, res) => { 
    try {
        let numbers_type = req.params.numbers_type; // Extract the type of numbers from the request parameters
        
        // Call the external API to get the data based on the numbers_type
        let response_from_testAPI = await fetch(`http://20.244.56.144/test/${numbers_type}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`, 
            }
        });
        

        let res = await response_from_testAPI.json();
        let data=res.data
        
        // Create a new Set to store unique values from the data
        let set = new Set();
        for (let value in data) { 
            set.add(value);
        }
        
        // Updated the current window state with the new data
        windowCurrState = new Set([...windowCurrState, ...set]);
        let sum=0;
        
        if (windowCurrState.length > windowSize) { 
            let diff = windowCurrState.size() - windowSize;
            
            
        
            windowCurrState = Array.from(windowCurrState).slice(diff, windowCurrState.size); 
        }
        else{
            windowCurrState=Array.from(windowCurrState)
        }
            
            for (let v in windowCurrState) { 
                sum += v;
            }
            
            // Send the response with the data, window states, and average
            res.status(200).json({
                numbers: data, // The numbers fetched from the external API
                windowPrevState: windowPrevState, // The previous state of the window
                windowCurrState: windowCurrState, // The current state of the window
                avg: (sum / windowCurrState.length) 
            });
        }
     catch (error) {
        // Handle errors and send a 500 response
        res.status(500).json({
            "status": "No data given by test API"
        });
    }
});

// Start the server on port 5000
app.listen(5000, () => {
    console.log("My Application is running at port 5000");
});
