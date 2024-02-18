const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')

const keyController = require('../controllers/keyController');

router.get('/add', ensureAuthenticated, keyController.viewKeywords);

router.get('/view', ensureAuthenticated, keyController.viewKeywords);

router.post('/add', ensureAuthenticated, keyController.addKeyword);

router.get('/update/:code&:name', ensureAuthenticated, keyController.updateKeyword);

module.exports = router;