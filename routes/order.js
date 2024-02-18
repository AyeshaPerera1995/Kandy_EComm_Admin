const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

const request = require('request');
const baseUrl = require('../config/key').baseUrl;

const orderController = require('../controllers/orderController');

router.get('/view_orders', ensureAuthenticated, (req, res)=>{
    res.render('view_orders');
});

router.get('/view_order_details/:orderCode', ensureAuthenticated, orderController.viewOrderInfo);

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
const bucket = storage.bucket("prescriptions_bucket_3"); // Get this from Google Cloud -> Storage
// cloud storage config -----------------------------------------------------------------------------------------

router.post("/update_prescription", multer.single("imgfile"), (req, response) => {
    const { id, status, updatedBy } = req.body;
    const accessToken = req.user.auth.token;
    //console.log(id, status,updatedBy,req.file.originalname)

    // upload images to cloud storage 
    try {
        if (req.file) {
            //console.log("File found, trying to upload...");
            const blob = bucket.file(req.file.originalname);
            const blobStream = blob.createWriteStream();
            blobStream.on("finish", () => {
                // response.status(200).send("Success");
                //console.log("Upload Img Success");
            });
            blobStream.end(req.file.buffer);
        } else throw "error with img";
    } catch (error) {
        response.status(500).send(error);
    }

    request({
        url: baseUrl + "/Prescription/Update",
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        method: 'PUT',
        body: {
            "id": id,
            "prescription": req.file.originalname,
            "status": status,
            "updatedBy": updatedBy
        },
        json: true
    }, function (err, res, body) {
        //console.log(body)
        if (err) throw err;
        if (body.status == 'Success') {
            response.status(200).send("Success");
        }
    });


})

module.exports = router;