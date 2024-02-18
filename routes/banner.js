const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

const request = require('request');
const baseUrl = require('../config/key').baseUrl;

const bannerController = require('../controllers/bannerController');

router.get('/add', ensureAuthenticated, (req, response) => {
    var accessToken = req.cookies.accToken;
    request({
        url: baseUrl + "/EcomBanner",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, res, body) {
        if (err) throw err;
        var bannersLength = 0;
        var bannerOne = bannerTwo = bannerThree = bannerFour = bannerFive = "";
        if (body.content == null) {
            bannersLength = 0;
            response.render('upload_banners', {
                success_msg: '',
                error_msg: '',
                bannersLength: bannersLength,
                bannerOne: "",
                bannerTwo: "",
                bannerThree: "",
                bannerFour: "",
                bannerFive: ""
            });
        } else {
            bannersLength = body.content.length;
            for (let i = 0; i < bannersLength; i++) {
                if(body.content[i].location == "Home Page One"){
                    //console.log(body.content[i].location) 
                    bannerOne = body.content[i] 
                 }else if(body.content[i].location == "Home Page Two"){
                     //console.log(body.content[i].location) 
                     bannerTwo = body.content[i] 
                 }else if(body.content[i].location == "Home Page Three"){
                     //console.log(body.content[i].location) 
                     bannerThree = body.content[i] 
                 }else if(body.content[i].location == "Products Page"){
                     //console.log(body.content[i].location) 
                     bannerFour = body.content[i] 
                 }else if(body.content[i].location == "Single Product Page"){
                     //console.log(body.content[i].location) 
                     bannerFive = body.content[i] 
                 } 
            }
                        
            response.render('upload_banners', {
                success_msg: '',
                error_msg: '',
                bannersLength: bannersLength,
                bannerOne: bannerOne,
                bannerTwo: bannerTwo,
                bannerThree: bannerThree,
                bannerFour: bannerFour,
                bannerFive: bannerFive
            });
        }

    });
});

router.get('/view', ensureAuthenticated, bannerController.viewBanners);

router.get('/update/:code', ensureAuthenticated, bannerController.getUpdateBanner);

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
    },
});

// cloud storage config -----------------------------------------------------------------------------------------
let projectId = "kandy-ecom-dev"; // Get this from Google Cloud
let keyFilename = "config/mykey.json"; // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
    projectId,
    keyFilename,
});
const bucket = storage.bucket("banners_bucket_2"); // Get this from Google Cloud -> Storage
// cloud storage config -----------------------------------------------------------------------------------------

router.post("/add", ensureAuthenticated, multer.single("imgfile"), (req, response) => {
    //console.log("in banner add")
    const { name, location, url, descOne, descTwo, descThree, existingImage } = req.body;
    // const accessToken = req.user.auth.token;
    var accessToken = req.cookies.accToken;
    const emp_code = req.user.employee.code;
    //console.log(accessToken)
    //console.log(emp_code)
    var imgUrl = ""
    var updateImage = ""
   
    // check if this banner already exist or not 
    request({
        url: baseUrl + "/EcomBanner/Location/" + location,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'GET',
        json: true
    }, function (err, res, body) {
        if (err) throw err;       
        if (body.status == "Fail") {
            // save new record
            //console.log("have to save a new record")
            // upload banner image to cloud storage 
            try {
                if (req.file) {
                    imgUrl = req.file.originalname;
                    //console.log("File found, trying to upload...");
                    const blob = bucket.file(req.file.originalname);
                    const blobStream = blob.createWriteStream();
                    blobStream.on("finish", () => {
                        //console.log("Upload banner Success");
                    });
                    blobStream.end(req.file.buffer);
                } else throw "error with img";
            } catch (error) {
                response.status(500).send(error);
            }

            // save banner 
            request({
                url: baseUrl + "/EcomBanner",
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                method: 'POST',
                body: {
                    "id": 1,
                    "bannerCode": null,
                    "bannerName": name,
                    "location": location,
                    "imageURL": imgUrl,
                    "redirectURL": url,
                    "description1": descOne,
                    "description2": descTwo,
                    "description3": descThree,
                    "isActive": true,
                    "isDeleted": false,
                    "createdBy": emp_code,
                    "createdDate": Date.now,
                    "updatedBy": null,
                    "updatedDate": null
                },
                json: true
            }, function (err, res, body) {
                //console.log(body)
                if (err) throw err;
                if (body.status == 'Success') {
                    //console.log('saved banner!')
                    response.status(200).send("Success");
                }
            });
        } else if (body.status == "Success") {
            // update existing record
            //console.log("need to update existing record")
            //console.log(req.file.originalname)
            // upload banner image to cloud storage 
            var bannerCode = body.content[0].bannerCode;
            try {
                if (req.file && existingImage == undefined) {
                    updateImage = req.file.originalname
                    //console.log("File found, trying to upload...");
                    const blob = bucket.file(req.file.originalname);
                    const blobStream = blob.createWriteStream();
                    blobStream.on("finish", () => {
                        //console.log("Upload banner Success");
                    });
                    blobStream.end(req.file.buffer);
                } else if(existingImage != undefined){
                    updateImage = existingImage
                } else throw "error with img";
            } catch (error) {
                response.status(500).send(error);
            }

            // update banner 
            request({
                url: baseUrl + "/EcomBanner",
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                method: 'PUT',
                body: {
                    "id": 1,
                    "bannerCode": bannerCode,
                    "bannerName": name,
                    "location": location,
                    "imageURL": updateImage,
                    "redirectURL": url,
                    "description1": descOne,
                    "description2": descTwo,
                    "description3": descThree,
                    "isActive": true,
                    "isDeleted": false,
                    "createdBy": emp_code,
                    "createdDate": null,
                    "updatedBy": null,
                    "updatedDate": Date.now
                },
                json: true
            }, function (err, res, body) {
                //console.log(body)
                if (err) throw err;
                if (body.status == 'Success') {
                    //console.log('updated banner!')
                    response.status(200).send("Success");
                }
            });
        }
    });

});




module.exports = router;