const { exitCode } = require('process');
const request = require('request');
const baseUrl = require('../config/key').baseUrl;

exports.viewManageStockPage = (req, response) => {
    var accessToken = req.cookies.accToken;
    // get main categories
    request({
        url: baseUrl + "/EcomCategory",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, res, maincatbody) {
        // get categories
        request({
            url: baseUrl + "/EcomSubCategory1",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            method: 'GET',
            json: true
        }, function (err, res, catbody) {
            // get sub categories
            request({
                url: baseUrl + "/EcomSubCategory2",
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                method: 'GET',
                json: true
            }, function (err, res, subcatbody) {
            // get all POS Products 
            request({
                url: baseUrl + "/EcomProduct/AddProduct/NameList",
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                method: 'GET',
                json: true
            }, function (err, res, probody) {
                response.render('manage_stocks', {
                    maincatlist: maincatbody.content,
                    catlist: catbody.content,
                    subcatlist: subcatbody.content,
                    prolist: probody.content,
                    accessToken: accessToken,
                    success_msg: '',
                    error_msg: ''
                });
            })
            })
        })
    })
}

exports.viewAvailableStocks = (req, response) => {
    var accessToken = req.cookies.accToken;
    var code = req.params.code;
    var stockList = "";
    // get available stocks by pos product code
    request({
        url: baseUrl + "/EcomProduct/StocksDetails?productCode="+code+"&nextPage=1&filter=0&rowCount=12&outofStock=false&onlineAvailable=false",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, res, body) {  
        if(body.content != null){
            stockList = body.content.List
        }     
        response.render('stock_details', {
            stockList: stockList,
            pro_code: code,
            success_msg: '',
            error_msg: ''
        });
    })
}