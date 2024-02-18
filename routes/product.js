const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

const request = require('request');
const baseUrl = require('../config/key').baseUrl;

const productController = require('../controllers/productController');
var imgList = [];

router.get('/add', ensureAuthenticated, productController.viewMainCategoriesAndProducts);

router.get('/view', ensureAuthenticated, (req, res) =>{
    res.render('view_products');
});

router.get('/update/:code', ensureAuthenticated, productController.getUpdateProduct);

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
const bucket = storage.bucket("products_bucket_1"); // Get this from Google Cloud -> Storage
// cloud storage config -----------------------------------------------------------------------------------------

router.post("/add", ensureAuthenticated, multer.single("imgfile"), async (req, response) => {
    const { product_code, product_name, generic_name, pack_size, company_code, manu_code, main_cat, cat, sub_cat, desc, imgListLength, current_element } = req.body;
    let needs_pres = req.body.needs_pres;
    const accessToken = req.user.auth.token;
    const emp_code = req.user.employee.code;

    // add imgUrls 
    imgList.push(req.file.originalname);

    try {
        if (req.file) {
          //console.log("File found, trying to upload...");
          const blob = bucket.file(req.file.originalname);
          const blobStream = blob.createWriteStream();
      
          // Create a promise that resolves when the blobStream finishes
          const uploadPromise = new Promise((resolve, reject) => {
            blobStream.on("finish", resolve);
            blobStream.on("error", reject);
          });
      
          blobStream.end(req.file.buffer);
      
          // Wait for the uploadPromise to resolve before continuing
          await uploadPromise;     
          //console.log("Upload Img Success");
        } else {
          throw "error with img";
        }
      } catch (error) {
        response.status(500).send(error);
      }

    if (needs_pres == 'true') {
        needs_pres = true;
    } else if (needs_pres == 'false') {
        needs_pres = false;
    }

    if (imgListLength == current_element) {
        //console.log("add product...........")
        request({
            url: baseUrl + "/EcomProduct",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            method: 'POST',
            body: {
                "id": null,
                "ecomProductCode": null,
                "posProductCode": product_code,
                "name": product_name,
                "genericName": generic_name,
                "productCompanyCode": company_code,
                "manufacturerCode": manu_code,
                "categoryCode": main_cat,
                "lockSales": true,
                "lockDiscount": true,
                "description": desc,
                "needsPrescription": needs_pres,
                "availableOnline": true,
                "thumbnailURL": null,
                "packSize": pack_size,
                "keywords": null,
                "isDeletable": true,
                "imageURLList": imgList,
                "isActive": true,
                "isDeleted": false,
                "createdBy": emp_code,
                "createdDate": Date.now,
                "updatedBy": null,
                "updatedDate": null,
                "ecomSubCategory1Code": cat,
                "ecomSubCategory2Code": sub_cat
            },
            json: true
        }, function (err, res, body) {
            //console.log(body)
            if (err) throw err;
            if (body.status == 'Success') {
                imgList = [];
                response.status(200).send("Success");
            }
        });
    }
    
    // response.status(200).send("Success");
});

router.post("/update", ensureAuthenticated, multer.single("imgfile"), (req, response) => {
    const { product_code, pos_product_code, product_name, generic_name, pack_size, company_code, manu_code, desc, imgListLength, current_element, img_name } = req.body;
    const imgfile = req.file;
    let needs_pres = req.body.needs_pres;
    const accessToken = req.user.auth.token;
    const emp_code = req.user.employee.code;
    // //console.log(current_element)
    // //console.log(imgfile)
    // //console.log(img_name)
    // //console.log(imgListLength)

    if (needs_pres == 'true') {
        needs_pres = true;
    } else if (needs_pres == 'false') {
        needs_pres = false;
    }

    // // upload new images
    if (imgfile != undefined) {
        //console.log("File found, trying to upload...");
        const blob = bucket.file(imgfile.originalname);
        const blobStream = blob.createWriteStream();
        blobStream.on("finish", () => {
            // response.status(200).send("Success");
            //console.log("Upload Img Success");
        });
        blobStream.end(req.file.buffer);
        imgList.push(imgfile.originalname)
    }

    // add already uploaded images to the imgList 
    if (img_name != undefined) {
        imgList.push(img_name)
    }

    if (imgListLength == current_element) {
        //console.log(imgList)

        // update product details 
        request({
            url: baseUrl + "/EcomProduct",
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            method: 'PUT',
            body: {
                "id": null,
                "ecomProductCode": product_code,
                "posProductCode": pos_product_code,
                "name": product_name,
                "genericName": generic_name,
                "productCompanyCode": company_code,
                "manufacturerCode": manu_code,
                "lockSales": true,
                "lockDiscount": true,
                "description": desc,
                "needsPrescription": needs_pres,
                "availableOnline": true,
                "thumbnailURL": null,
                "packSize": pack_size,
                "isDeletable": true,
                "imageURLList": imgList,
                "isActive": true,
                "isDeleted": false,
                "createdBy": null,
                "createdDate": null,
                "updatedBy": emp_code,
                "updatedDate": Date.now
            },
            json: true
        }, function (err, res, body) {
            //console.log(body)
            if (err) throw err;
            if (body.status == 'Success') {
                imgList = [];
                response.status(200).send("Success");
            }
        });
    }
});

module.exports = router;