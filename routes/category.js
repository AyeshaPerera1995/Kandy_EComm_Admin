const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const request = require('request');
const baseUrl = require('../config/key').baseUrl;

const catController = require('../controllers/catController');

router.get('/fetch_cats', (req, response) => {
    var catlist;
    var accessToken = req.cookies.accToken;
    var code = req.query.code
    request({
        url: baseUrl + "/EcomCategory/" + code + "/SubCategories",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, res, body) {
        catlist = body.content
        response.json(catlist);
    })
   
});

router.get('/add', ensureAuthenticated, catController.viewCategories);

router.get('/view', ensureAuthenticated, catController.viewCategories);

router.post('/add', ensureAuthenticated, catController.addCategory);

router.get('/update/:code&:name', ensureAuthenticated, catController.updateCategory);

module.exports = router;