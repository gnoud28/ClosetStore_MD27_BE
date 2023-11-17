const express = require('express');
const routeProduct = require('./routeProduct');
const routeCart = require('./routeCart');
const routeCategory = require('./routeCategory.js');
const routeUser = require('./routeUSer.js');
const routeChart = require('./routeChart.js');
const routes = express.Router();


routes.use('/products', routeProduct)
routes.use('/cart', routeCart)
routes.use('/categoty', routeCategory)
routes.use('/user', routeUser)
routes.use('/chart', routeChart)



module.exports = routes