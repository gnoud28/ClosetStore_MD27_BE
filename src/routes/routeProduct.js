const express = require('express');
const { getListAllProducts, getListBannerProducts, searchProducts, searchProductsByName, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product');
const routeProduct = express.Router();


routeProduct.get('/getallproducts', getListAllProducts);
routeProduct.get('/getbannerproducts', getListBannerProducts);
routeProduct.get('/searchproducts', searchProducts);
routeProduct.get('/searchproductsbyname/:name', searchProductsByName);
routeProduct.get('/getproductsbyid/:productId', getProductById);
routeProduct.post('/createproduct', createProduct);
routeProduct.post('/updateproduct', updateProduct);
routeProduct.delete('/deleteproduct/:id', deleteProduct);



module.exports = routeProduct