const express = require('express')

//mergeParams:true to get the tourId from the rout 
const routers = express.Router();

const authentication = require('../controllers/authenticationCnt')


routers.route('/login').post(authentication.login)
routers.route('/signup').post(authentication.signup)


module.exports = routers;