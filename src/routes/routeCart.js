const express = require('express');
const { addToShoppingCart, getListCart, updateQuantityCart, deleteItemCart, createPayment, historyOrder,  } = require('../controllers/cart');
const routeCart = express.Router();


routeCart.post('/orderproduct', addToShoppingCart);
routeCart.get('/getlistorder/:id', getListCart);
routeCart.post('/updatequantitycart', updateQuantityCart);
routeCart.delete('/deleteitemcart/:id', deleteItemCart);


routeCart.post('/create_payment_url', createPayment);
routeCart.get('/history/:id', historyOrder);



module.exports = routeCart