const express = require('express');
const { getListProductByCategory, getListCategory } = require('../controllers/category');

const routeCategory = express.Router();


routeCategory.post('/getproductbycategory', getListProductByCategory);
routeCategory.get('/getlistcategory', getListCategory);





module.exports = routeCategory