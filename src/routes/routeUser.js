const express = require('express');
const { checkEmailLogin, createUser, verifyOTP, forgotPassword, verifyOTPAndResetPassword, loginUserEmailPasword, getListUser, deleteUser,  } = require('../controllers/user');
const routeUser = express.Router();


routeUser.post('/loginemail', checkEmailLogin);
routeUser.post('/createuser', createUser);
routeUser.post('/verifyotp', verifyOTP);
routeUser.post('/forgotpassword', forgotPassword);
routeUser.post('/resetpassword', verifyOTPAndResetPassword);
routeUser.post('/loginemailpassword', loginUserEmailPasword);
routeUser.get('/getalluser', getListUser);
routeUser.delete('/deleteuser/:id',deleteUser );




module.exports = routeUser