// Setup the basic app
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
// require('dotenv').config() // DEV PURPOSE
const app = express()

// Create the connection
var connection = mysql.createPool({
    connectionLimit : 10,
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASS,
    database : process.env.DB
})

// Set the body to be parsed
bodyParser.urlencoded({ extended: true })
app.use(bodyParser.json())

// Set the port to the process port or 8080
const port = process.env.PORT || 8080

// API Keys
const apiKeys = [
    'afdc4b44-5463-4c7e-a35d-84c5c316fa37'
]

// Default page
app.get('/', (req, res) => {
    res.json({ api_name: "Game API", api_version: "1.0.0" })
})

// A route for the items endpoint
app.route('/items')
    .get((req, res) => {

        // Get the API key in the headers
        var apikey = req.get('x-api-key')

        // Check if there is an API key sent
        if (apikey == null) {
            res.status(400)
            return res.json({ "error_code": 400, "error_message": "No API key was provided!" })
        }

        // Check if the API key is valid
        if (!apiKeys.includes(apikey)) {
            res.status(401)
            return res.json({ "error_code": 401, "error_message": "Invalid API key!" })
        }

        // To store objects to send to user
        var items = []

        // Query the DB for all items
        connection.query('SELECT * FROM items', (error, results, fields) => {

            if (error) throw error

            // For all of the results
            results.forEach(element => {

                // Create an object
                var item = {
                    item_name: element['item_name'],
                    item_quantity: element['item_quantity'],
                    item_price: element['item_price'],
                    item_uniqueid: element['item_uniqueid']
                }
                
                // Push the new object to the array
                items.push(item)
            })

            // Send the user the objects
            console.log(`A \u001b[34mGET \u001b[0mrequest was performed on /items with ${apikey}`)
            res.json({ items })

        })
        
    })
    .post((req, res) => {

        // Get the API key in the headers
        var apikey = req.get('x-api-key')

        // Check if there is an API key sent
        if (apikey == null) {
            res.status(400)
            return res.json({ "error_code": 400, "error_message": "No API key was provided!" })
        }

        // Check if the API key is valid
        if (!apiKeys.includes(apikey)) {
            res.status(401)
            return res.json({ "error_code": 401, "error_message": "Invalid API key!" })
        }

        // Fetch the body
        var name = req.body['item_name']
        var quantity = req.body['item_quantity']
        var price = req.body['item_price']
        var uniqueid = req.body['item_uniqueid']

        // Check if the required info is present
        if (name == null || quantity == null || price == null || uniqueid == null) {
            res.status(400)
            return res.json({ "error_code": 400, "error_message": "There is an error with the info you provided!" })
        }

        // Query the DB
        connection.query('INSERT INTO items (item_name, item_quantity, item_price, item_uniqueid) VALUES ("' + name + '", "' + quantity + '", "' + price + '", "' + uniqueid + '")', (error, results, fields) => {
            if (error) throw error
        })

        // Send the user the objects
        console.log(`A \u001b[32mPOST \u001b[0mrequest was performed on /items with ${apikey}`)
        res.status(200)
        res.json(req.body)
        
    })
    .delete((req, res) => {

        // Get the API key in the headers
        var apikey = req.get('x-api-key')

        // Check if there is an API key sent
        if (apikey == null) {
            res.status(400)
            return res.json({ "error_code": 400, "error_message": "No API key was provided!" })
        }

        // Check if the API key is valid
        if (!apiKeys.includes(apikey)) {
            res.status(401)
            return res.json({ "error_code": 401, "error_message": "Invalid API key!" })
        }

        // Fetch the body
        var uniqueid = req.body['item_uniqueid']

        // Check if the required info is present
        if (uniqueid == null) {
            res.status(400)
            return res.json({ "error_code": 400, "error_message": "There is an error with the info you provided!" })
        }

        connection.query('DELETE FROM items WHERE item_uniqueid="' + uniqueid + '"', (error, results, fields) => {
            if (error) throw error
        })

        // Send the user the objects
        console.log(`A \u001b[31mDELETE \u001b[0mrequest was performed on /items with ${apikey}`)
        res.json(req.body)
        
    })

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
