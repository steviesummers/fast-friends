const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv').config()
const port = 3001;
const mongoUrl = process.env.MONGO_URL

const server = app.listen(port, () => console.log("Server listening on Port: "+ port))

mongoose.connect(mongoUrl).then(() => {
    console.log("connected to DB successfully")
}).catch((err) => {
    console.log("Failed to connect to DB", err)
})