const request = require('request');
const baseUrl = require('../config/key').baseUrl;

exports.addMainCategory = (req, response) => {
    const { main_category_name, accessToken, emp_code } = req.body;
    var error_msg = '';
   
    request({
        url: baseUrl + "/EcomCategory",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'POST',
        body: {
            "isActive": true,
            "isDeleted": false,
            "createdBy": emp_code,
            "createdDate": null,
            "updatedBy": null,
            "updatedDate": null,
            "id": null,
            "code": null,
            "name": main_category_name
            
        },
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        if (body.status == 'Success') {
            var success_msg = 'SUCCESS: Main category added successfully.';
            response.redirect('/maincategory/add?success_msg=' + encodeURIComponent(success_msg));
        } else {
            error_msg = 'Error! Please try again.';
            response.redirect('/maincategory/add?error_msg=' + encodeURIComponent(error_msg));
        }
    });
}

exports.viewMainCategories = (req, response) => {
    var accessToken = req.cookies.accToken;
    request({
        url: baseUrl + "/EcomCategory",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        response.render('main_categories', {
            maincatlist: body.content,
            success_msg: '',
            error_msg: ''
        });
    });
}

exports.updateMainCategory = (req, response) => {
    var accessToken = req.cookies.accToken;
    const code = req.params.code;
    const name = req.params.name;
    var error_msg = '';

    if (error_msg != '') {
        response.redirect('/maincategory/add?error_msg=' + encodeURIComponent(error_msg));
    } else {
        request({
            url: baseUrl + "/EcomCategory",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            method: 'PUT',
            body: {
                "code": code,
                "name": name
            },
            json: true
        }, function (err, res, body) {
            if (err) throw err;
            if (body.status == 'Success') {
                var success_msg = 'SUCCESS: Main category updated successfully.';
                response.redirect('/maincategory/add?success_msg=' + encodeURIComponent(success_msg));
            } else {
                error_msg = 'Error! Please try again.';
                response.redirect('/maincategory/add?error_msg=' + encodeURIComponent(error_msg));
            }
        });
    }
}

