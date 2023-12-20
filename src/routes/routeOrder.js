const express = require('express');
const { getListOrder, updateOrder } = require('../controllers/order');
const routeOrder = express.Router();


routeOrder.get('/getlistorder', getListOrder);
routeOrder.post('/updateOrder', updateOrder);




module.exports = routeOrder