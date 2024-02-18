const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;

const server = app.listen(port, () => console.log("Server listening on Port: "+ port))