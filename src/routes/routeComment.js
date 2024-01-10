const express = require('express');
const { getListCommentByProductId,getAllComments,createComment  } = require('../controllers/comment');
const routeOrder = express.Router();

routeOrder.get('/getAllComments', getAllComments);
routeOrder.get('/getListCommentByProductId/:productId', getListCommentByProductId);
routeOrder.post('/createComment', createComment);

module.exports = routeOrder