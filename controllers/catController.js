const request = require('request');
const baseUrl = require('../config/key').baseUrl;

exports.addCategory = (req, response) => {
    const { main_category_code, category_name, accessToken, emp_code } = req.body;
    var error_msg = '';
    // const currentDateTime = new Date().toLocaleString('en-US', {
    //     timeZone: 'Asia/Colombo'
    // });

    request({
        url: baseUrl + "/EcomSubCategory1",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'POST',
        body: {
            "id": null,
            "code": null,
            "ecomCategoryCode": main_category_code,
            "name": category_name,
            "isActive": true,
            "isDeleted": false,
            "createdBy": emp_code,
            "createdDate": null,
            "updatedBy": null,
            "updatedDate": null
        },
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        if (body.status == 'Success') {
            console.log('add cat')
            var success_msg = 'SUCCESS: Category added successfully.';
            response.redirect('/category/add?success_msg=' + encodeURIComponent(success_msg));
        } else {
            error_msg = 'Error! Please try again.';
            response.redirect('/category/add?error_msg=' + encodeURIComponent(error_msg));
        }
    });

}

exports.viewCategories = (req, response) => {
    var accessToken = req.cookies.accToken;

    request({
        url: baseUrl + "/EcomSubCategory1",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, res, catbody) {
        if (err) throw err;
        // getAllMainCategories
        request({
            url: baseUrl + "/EcomCategory",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            method: 'GET',
            json: true
        }, function (err, resp, maincatbody) {
            if (err) throw err;
            response.render('categories', {
                catlist: catbody.content,
                maincatlist: maincatbody.content,
                success_msg: '',
                error_msg: ''
            });
        });
    });
}

exports.updateCategory = (req, response) => {
    var accessToken = req.cookies.accToken;
    const code = req.params.code;
    const name = req.params.name;
    var error_msg = '';

    if (error_msg != '') {
        response.redirect('/category/add?error_msg=' + encodeURIComponent(error_msg));
    } else {
        request({
            url: baseUrl + "/EcomSubCategory1",
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
                var success_msg = 'SUCCESS: Category updated successfully.';
                response.redirect('/category/add?success_msg=' + encodeURIComponent(success_msg));
            } else {
                error_msg = 'Error! Please try again.';
                response.redirect('/category/add?error_msg=' + encodeURIComponent(error_msg));
            }
        });
    }
}
