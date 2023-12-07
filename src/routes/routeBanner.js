const express = require('express');
const { getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/banner');
const routeBanner = express.Router();

// Routes cho controller Banner
routeBanner.get('/getlistbanner', getAllBanners);
routeBanner.post('/createBanner', createBanner);
routeBanner.post('/updateBanner', updateBanner);
routeBanner.delete('/deleteBanner/:banner_id', deleteBanner);

module.exports = routeBanner;
