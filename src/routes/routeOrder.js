const express = require('express');
const { getListOrder, updateOrder, getOrdersByStatus } = require('../controllers/order');
const routeOrder = express.Router();


routeOrder.get('/getlistorder', getListOrder);
routeOrder.post('/updateOrder', updateOrder);

routeOrder.get('/getOrdersByStatus/:status', getOrdersByStatus);




module.exports = routeOrder