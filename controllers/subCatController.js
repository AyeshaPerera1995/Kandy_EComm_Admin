const request = require('request');
const baseUrl = require('../config/key').baseUrl;

exports.addSubCategory = (req, response) => {
    const { category_code, sub_category_name, accessToken, emp_code } = req.body;
    var error_msg = '';
    request({
        url: baseUrl + "/EcomSubCategory2",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'POST',
        body: {
            "id": null,
            "code": null,
            "ecomSubCategory1Code": category_code,
            "name": sub_category_name,
            "isActive": true,
            "isDeleted": false,
            "createdBy": emp_code,
            "createdDate": null,
            "updatedBy": "",
            "updatedDate": null
        },
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        if (body.status == 'Success') {
            var success_msg = 'SUCCESS: Sub Category added successfully.';
            response.redirect('/subcategory/add?success_msg=' + encodeURIComponent(success_msg));
        } else {
            error_msg = 'Error! Please try again.';
            response.redirect('/subcategory/add?error_msg=' + encodeURIComponent(error_msg));
        }
    });

}

exports.viewSubCategories = (req, response) => {
    var accessToken = req.cookies.accToken;

    request({
        url: baseUrl + "/EcomSubCategory2",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, res, subcatbody) {
        if (err) throw err;
        // getAllCategories
        request({
            url: baseUrl + "/EcomSubCategory1",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            method: 'GET',
            json: true
        }, function (err, resp, catbody) {
            if (err) throw err;
            response.render('sub_categories', {
                catlist: catbody.content,
                subcatlist: subcatbody.content,
                success_msg: '',
                error_msg: ''
            });
        });

    });
}

exports.updateSubCategory = (req, response) => {
    var accessToken = req.cookies.accToken;
    const code = req.params.code;
    const name = req.params.name;
    var error_msg = '';

    if (error_msg != '') {
        response.redirect('/subcategory/add?error_msg=' + encodeURIComponent(error_msg));
    } else {
        request({
            url: baseUrl + "/EcomSubCategory2",
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
                var success_msg = 'SUCCESS: Sub Category updated successfully.';
                response.redirect('/subcategory/add?success_msg=' + encodeURIComponent(success_msg));
            } else {
                error_msg = 'Error! Please try again.';
                response.redirect('/subcategory/add?error_msg=' + encodeURIComponent(error_msg));
            }
        });
    }
}
