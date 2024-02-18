const passport = require('passport');
const request = require('request');
const baseUrl = require('../config/key').baseUrl;

//Login Handle
exports.loginHandle = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
}


//------------ Logout Handle ------------//
exports.logoutHandle = (req, res) => {
    //console.log('in logout....................')
    res.clearCookie("accToken");
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}













// exports.createUser = (req, resp) => {
//     const { fname, lname, username, user_type, password, cpassword, accessToken } = req.body;
//     var error_msg = '';

//     //console.log(req.body);

//     //------------ Checking required fields ------------//
//     if (!fname || !lname || !username || !user_type || !password || !cpassword) {
//         error_msg = 'Please fill required fields.';
//     }

//     if (error_msg != '') {
//         resp.render('add_user', {
//             title: 'Add Information',
//             sub_title: 'New User',
//             error_msg: error_msg
//         });
//     } else {

//         request({
//             headers: {
//                 'AccessToken': accessToken
//             },
//             url: baseUrl+"/User/UserRegistration",
//             method: 'POST',
//             body:{
//                 "user_name":username,
//                 "first_name":fname,
//                 "last_name":lname,
//                 "contact_number":"",
//                 "email":"",
//                 "user_type":user_type,
//                 "password":password
//             },
//             json: true
//           }, function (err, res, body) {
//             if(err) throw err;
//             //console.log(body); 
//             if (body.response.Status =='Fail') {
//                 //console.log(body.response.Details);
//                 error_msg = 'Error! Please try again.';
//                 resp.render('add_user',{error_msg: error_msg, sub_title: 'New User', title: 'Add Information'});
//             }else{
//                 //console.log('else');
//                 resp.render('add_user',{success_msg: 'User saved successfully.', sub_title: 'New User', title: 'Add Information'});
//             }
//           });

//     }
// }

