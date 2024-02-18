const request = require('request');
const baseUrl = require('../config/key').baseUrl;

// exports.viewProducts = (req, response) => {
//     var accessToken = req.cookies.accToken;
//     // get all POS Products 
//     request({
//         url: baseUrl + "/EcomProduct?nextPage=1&rowCount=12",
//         headers: {
//             'Authorization': 'Bearer ' + accessToken
//         },
//         method: 'GET',
//         json: true
//     }, function (err, res, body) {
//         if (err) throw err;
//             response.render('view_products', {
//                 prolist: body.content.List,
//                 accessToken: accessToken
//             });
        
//     });
// }

exports.getUpdateProduct = (req, response) => {
    var accessToken = req.cookies.accToken;
    const code = req.params.code;
    // get single product
    request({
        url: baseUrl + "/EcomProduct/" + code,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, resp, body) {
        if (err) throw err;
        if (body.status == 'Success') {
            // get main categories
            request({
                url: baseUrl + "/EcomCategory",
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                method: 'GET',
                json: true
            }, function (err, res, maincatbody) {
                if (err) throw err;
                if (maincatbody.status == 'Success') {
                    response.render('update_single_product', {
                        maincatlist: maincatbody.content,
                        product: body.content,
                        accessToken: accessToken
                    });
                }
            })
        }
    })
}

exports.viewMainCategoriesAndProducts = (req, response) => {
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
        if (err) throw err;
            // get all POS Products 
            request({
                url: baseUrl + "/EcomProduct/AddProduct/NameList",
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                method: 'GET',
                json: true
            }, function (err, res, probody) {
                if (err) throw err;
                // if (probody.status == 'Success') {
                    // //console.log(probody.content)
                    response.render('add_product', {
                        maincatlist: maincatbody.content,
                        prolist: probody.content,
                        accessToken: accessToken
                    });
                // }
            });
    });
}