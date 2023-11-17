const express = require('express');
const { addToShoppingCart, getListCart, updateQuantityCart, deleteItemCart } = require('../controllers/cart');
const routeCart = express.Router();


routeCart.post('/orderproduct', addToShoppingCart);
routeCart.get('/getlistorder/:id', getListCart);
routeCart.post('/updatequantitycart', updateQuantityCart);
routeCart.delete('/deleteitemcart/:id', deleteItemCart);




module.exports = routeCart