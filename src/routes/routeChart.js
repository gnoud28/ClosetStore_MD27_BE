const express = require('express');
const { getOrderCountAndTotalWithinMonth, getSuccessfulOrdersWithinDateRange } = require('../controllers/chart');
const routeChart = express.Router();

// Endpoint cho thống kê theo tháng
routeChart.post('/getchart/:year/:month', getOrderCountAndTotalWithinMonth);

// Endpoint cho thống kê theo ngày trong khoảng thời gian cụ thể
routeChart.get('/successful-orders', getSuccessfulOrdersWithinDateRange);

module.exports = routeChart;
