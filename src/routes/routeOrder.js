const express = require('express');
const { getListOrder } = require('../controllers/order');
const routeOrder = express.Router();


routeOrder.get('/getlistorder', getListOrder);





module.exports = routeOrder