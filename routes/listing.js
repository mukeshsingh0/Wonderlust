const express =require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");

const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

// index && create route
router
 .route("/")
 .get(wrapAsync(listingcontroller.index))
 .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingcontroller.createListing));
// .post(upload.single("listing[image]"),(req,res)=>{
//     res.send(req.file);
// });

// new route
router.get("/new",isLoggedIn,listingcontroller.newFormRender);

// show ,update && delete route
router
 .route("/:id")
 .get(wrapAsync(listingcontroller.showListing))
 .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingcontroller.updateListing))
 .delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.deleteListing));

// edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.editListing));


module.exports=router;