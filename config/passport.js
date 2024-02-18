const LocalStrategy = require('passport-local').Strategy;
const request = require('request');

//------------ API Configuration ------------//
const baseUrl = require('../config/key').baseUrl;

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'admin_email', passwordField: 'admin_password' }, (username, password, done) => {
            //------------ User Matching ------------//

            request({
                url: baseUrl+'/Employee/login',
                method: 'POST',
                body:{
                    "userName": username,
                    "password": password,
                    "employeeBarcode": null
                    },
                json: true
              }, function (err, res, body) {

                if (err) { 
                    return done(null, false, { message: 'Login Error!' });  
                }
                 
                if (body.status == 'Success') {
                    //console.log(body.status);
                    return done(null, body.content);
                }else if(body.status == 'Fail'){
                    //console.log(body.message);
                    return done(null, false, { message: `Invalid Login! ${body.message}` });  
                }else{
                    return done(null, false, { message: `Invalid Login! ${body.message}` });  
                }
            });

        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);  
    });
};