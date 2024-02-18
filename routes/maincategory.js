const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const request = require('request');
const baseUrl = require('../config/key').baseUrl;

const mainCatController = require('../controllers/mainCatController');

router.get('/fetch_main_cats', (req, response) => {
    var maincatlist;
    var accessToken = req.cookies.accToken;
    request({
        url: baseUrl + "/EcomCategory",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, res, body) {
        maincatlist = body.content
        response.json(maincatlist);
    })

    // setTimeout(() => {
    //     response.json(maincatlist);
    // }, 5000); // Simulated delay of 5 second
   
});

router.get('/add', ensureAuthenticated, mainCatController.viewMainCategories);

router.get('/view', ensureAuthenticated, mainCatController.viewMainCategories);

router.post('/add', ensureAuthenticated, mainCatController.addMainCategory);

router.get('/update/:code&:name', ensureAuthenticated, mainCatController.updateMainCategory);

module.exports = router;