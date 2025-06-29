const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const express = require('express');
const app = require('./app');


const port = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});