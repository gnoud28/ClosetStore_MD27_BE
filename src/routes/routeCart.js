const express = require('express');
const { addToShoppingCart, getListCart, updateQuantityCart, deleteItemCart, createPayment, historyOrder,  } = require('../controllers/cart');
const { createNotification, getListNoti } = require('../controllers/notication');
const routeCart = express.Router();


routeCart.post('/orderproduct', addToShoppingCart);
routeCart.get('/getlistorder/:id', getListCart);
routeCart.post('/updatequantitycart', updateQuantityCart);
routeCart.delete('/deleteitemcart/:id', deleteItemCart);


routeCart.post('/create_payment_url', createPayment);
routeCart.get('/history/:id', historyOrder);




routeCart.post('/createnoti', createNotification);
routeCart.get('/getlistnoti', getListNoti);



module.exports = routeCart