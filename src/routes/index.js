const express = require('express');
const routeProduct = require('./routeProduct');
const routeCart = require('./routeCart');
const routeCategory = require('./routeCategory.js');
const routeUser = require('./routeUSer.js');
const routeChart = require('./routeChart.js');
const routeOrder = require('./routeOrder.js');
const routeBanner = require('./routeBanner.js');
const routes = express.Router();


routes.use('/products', routeProduct)
routes.use('/cart', routeCart)
routes.use('/categoty', routeCategory)
routes.use('/user', routeUser)
routes.use('/chart', routeChart)
routes.use('/order', routeOrder)
routes.use('/banner', routeBanner)



module.exports = routes