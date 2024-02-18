const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/checkAuth')

const authController = require('../controllers/authController');

//LOGIN
router.post('/login', authController.loginHandle);

// REGISTER 
router.get('/register', (req, res) => {
    res.render('register',{
        error_msg: '',
        success_msg: '',
        
    });
});

router.get('/edit', (req, res) => res.render('my_account'));

// //------------ Reset Password Handle ------------//
// router.post('/reset_pass', ensureAuthenticated, authController.resetPassword);

//------------ Logout GET Handle ------------//
router.get('/logout', authController.logoutHandle);

module.exports = router;