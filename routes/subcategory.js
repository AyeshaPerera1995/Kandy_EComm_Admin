const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const request = require('request');
const baseUrl = require('../config/key').baseUrl;

const subCatController = require('../controllers/subCatController');

router.get('/fetch_sub_cats', (req, response) => {
    var subcatlist;
    var accessToken = req.cookies.accToken;
    var code = req.query.code
    request({
        url: baseUrl + "/EcomSubCategory1/" + code + "/SubCategories",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, res, body) {
        subcatlist = body.content
        response.json(subcatlist);
    })
   
});

router.get('/add', ensureAuthenticated, subCatController.viewSubCategories);

router.get('/view', ensureAuthenticated, subCatController.viewSubCategories);

router.post('/add', ensureAuthenticated, subCatController.addSubCategory);

router.get('/update/:code&:name', ensureAuthenticated, subCatController.updateSubCategory);

module.exports = router;