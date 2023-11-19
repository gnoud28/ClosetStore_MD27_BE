const express = require('express');
const { getListProductByCategory, getListCategory, createCategory, updateCategory } = require('../controllers/category');

const routeCategory = express.Router();


routeCategory.post('/getproductbycategory', getListProductByCategory);
routeCategory.get('/getlistcategory', getListCategory);
routeCategory.post('/createcategory', createCategory);
routeCategory.post('/updatecategory', updateCategory);





module.exports = routeCategory