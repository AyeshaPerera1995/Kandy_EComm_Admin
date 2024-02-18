const { exitCode } = require('process');
const request = require('request');
const baseUrl = require('../config/key').baseUrl;

exports.viewBanners = (req, response) => {
    var accessToken = req.cookies.accToken;
        request({
            url: baseUrl+"/EcomBanner",
            headers: {
                'Authorization': 'Bearer '+ accessToken
            },
            method: 'GET',
            json: true
          }, function (err, res, body) {
            if(err) throw err;
                 response.render('view_banners',{
                    bannerlist:  body.content,
                    success_msg:'',
                    error_msg: '' 
                });
          });   
}

exports.getUpdateBanner = (req, response) => {
    var accessToken = req.cookies.accToken;
    const code = req.params.code;

        request({
            url: baseUrl+"/EcomBanner"+code,
            headers: {
                'Authorization': 'Bearer '+ accessToken
            },
            method: 'GET',
            json: true
          }, function (err, res, body) {
            if(err) throw err;
            if (body.status =='Success') {
                 response.render('view_banners',{
                    bannerInfo:  body.content
                });
            }
          });   
}

