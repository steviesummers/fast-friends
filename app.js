const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv').config()
const port = 3001;
const mongoUrl = process.env.MONGO_URL
const bodyParser = require('body-parser');

const server = app.listen(port, () => console.log("Server listening on Port: "+ port))

mongoose.connect(mongoUrl).then(() => {
    console.log("connected to DB successfully")
}).catch((err) => {
    console.log("Failed to connect to DB", err)
})

const userRoute = require('./routes/userRoutes')
const thoughtRoute = require('./routes/thoughtRoutes')

// For JSON parsing
app.use(express.json());

// For URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoute)
app.use("/thoughts", thoughtRoute)