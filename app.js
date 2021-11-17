const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan')
const authenticationroute = require('./Routes/authenticationroute')

const app = express();

 /* bodyParser.json() is deprecated */
app.use(morgan('dev'))
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */
app.use(express.json());
app.use('/authentication' , authenticationroute);


const port = 8001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });