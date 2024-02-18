const { exitCode } = require('process');
const request = require('request');
const baseUrl = require('../config/key').baseUrl;

exports.viewKeywords = (req, response) => {
    var accessToken = req.cookies.accToken;
    request({
        url: baseUrl + "/EcomKeyword",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        response.render('keywords', {
            keylist: body.content,
            success_msg: '',
            error_msg: ''
        });
    });
}

exports.addKeyword = (req, response) => {
    const { keyword_text, accessToken, emp_code } = req.body;
    var error_msg = '';
        request({
            url: baseUrl + "/EcomKeyword",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            method: 'POST',
            body: {
                "id": null,
                "ecomKeywordCode": null,
                "keywordText":keyword_text,
                "isActive": true,
                "isDeleted": false,
                "createdBy": emp_code,
                "createdDate": Date.now,
                "updatedBy": "",
                "updatedDate": null
            },
            json: true
        }, function (err, res, body) {
            if (err) throw err;
            if (body.status == 'Success') {
                var success_msg = 'SUCCESS: Keyword added successfully.';
                response.redirect('/keyword/add?success_msg=' + encodeURIComponent(success_msg));
            } else {
                error_msg = 'Error! Please try again.';
                response.redirect('/keyword/add?error_msg=' + encodeURIComponent(error_msg));
            }
        });
}

exports.updateKeyword = (req, response) => {
    var accessToken = req.cookies.accToken;
    const code = req.params.code;
    const text = req.params.name;
    var error_msg = '';

    if (error_msg != '') {
        response.redirect('/keyword/add?error_msg=' + encodeURIComponent(error_msg));
    } else {
        request({
            url: baseUrl+"/EcomKeyword",
            headers: {
                'Authorization': 'Bearer '+ accessToken
            },
            method: 'PUT',
            body:{
                "ecomKeywordCode": code,
                "keywordText":text,
            },
            json: true
          }, function (err, res, body) {
            if(err) throw err;
            if (body.status =='Success') {
                var success_msg = 'SUCCESS: Keyword updated successfully.';
                response.redirect('/keyword/add?success_msg=' + encodeURIComponent(success_msg));
            }else{
                error_msg = 'Error! Please try again.';
                response.redirect('/keyword/add?error_msg=' + encodeURIComponent(error_msg));               
            }
          });
    }
}

