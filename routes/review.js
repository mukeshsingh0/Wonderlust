const express =require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/expressError.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const{validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js")
const reviewControllers=require("../controllers/review.js");

// review rout

router.post("/", isLoggedIn,validateReview,wrapAsync(reviewControllers.createReview));

// delete  review route

router.delete("/:reviewId" ,isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.deleteReview));


module.exports=router;