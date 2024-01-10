const express = require('express');
const { getListCommentByProductId,getAllComments,createComment,deleteComment  } = require('../controllers/comment');
const routerComment = express.Router();

routerComment.get('/getAllComments', getAllComments);
routerComment.get('/getListCommentByProductId/:productId', getListCommentByProductId);
routerComment.post('/createComment', createComment);

routerComment.delete('/deleteComment/:commentId', deleteComment);

module.exports = routerComment