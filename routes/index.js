const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');

const request = require('request');
const baseUrl = require('../config/key').baseUrl;

router.get('/', (req, res) => res.render('admin_login'));

router.get('/home', ensureAuthenticated, (req, res) => {
    res.cookie('accToken', req.user.auth.token);
    res.render('home')
});

module.exports = router;