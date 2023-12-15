const express = require('express');
const { getListProductByCategory, getListCategory, createCategory, updateCategory, getListProductByCategoryID,deleteCategoryById, delteteCate } = require('../controllers/category');

const routeCategory = express.Router();


routeCategory.post('/getproductbycategory', getListProductByCategory);
routeCategory.get('/getlistcategory', getListCategory);
routeCategory.get('/getlistcategoryid/:category_id', getListProductByCategoryID);
routeCategory.post('/createcategory', createCategory);
routeCategory.post('/updatecategory', updateCategory);
routeCategory.delete('/deleteCategory/:category_id', deleteCategoryById);


routeCategory.get('/deleteCate/:category_id', delteteCate);





module.exports = routeCategory