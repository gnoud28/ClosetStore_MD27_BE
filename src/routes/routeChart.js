const express = require('express');
const { getOrderCountAndTotalWithinMonth } = require('../controllers/chart');
const routeChart = express.Router();


routeChart.post('/getchart/:year/:month', getOrderCountAndTotalWithinMonth);





module.exports = routeChart