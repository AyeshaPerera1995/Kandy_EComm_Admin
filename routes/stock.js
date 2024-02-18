const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')

const stockController = require('../controllers/stockController');

router.get('/filter', ensureAuthenticated, stockController.viewManageStockPage);

router.get('/stock_info/:code', ensureAuthenticated, stockController.viewAvailableStocks);


module.exports = router