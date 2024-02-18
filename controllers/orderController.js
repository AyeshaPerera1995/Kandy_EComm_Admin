const request = require('request');
const baseUrl = require('../config/key').baseUrl;

exports.viewOrderInfo = (req, response) => {
    var accessToken = req.cookies.accToken;
    var orderCode = req.params.orderCode;
    request({
        url: baseUrl + "/CustomerOrder/Select/OrderCode/Full?orderCode="+orderCode,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, res, body) {  
        // //console.log(typeof body.content.CustomerOrder);
        // //console.log(body.content.CustomerOrder);
        // //console.log(body.content.CustomerOrder.prescriptionFullDetails);

        response.render('view_order_details', {
            orderInfo: body.content,
            success_msg: '',
            error_msg: ''
        });
    })
}