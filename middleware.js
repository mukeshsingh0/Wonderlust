const Listing =require("./models/listing");
const Reviews =require("./models/review");
const expressError=require("./utils/expressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

// module.exports.isLoggedIn=(req,res,next)=>{
//     if(!req.isAuthenticated()){
//         req.session.redirectUrl=req.originalUrl;
//         req.flash("error","You must be logged in to create listing");
//         return res.redirect("/login");

//     }
//     next();
// };
module.exports.isLoggedIn = (req, res, next) => {
    // console.log("Inside isLoggedIn middleware");
    // console.log("req.isAuthenticated():", req.isAuthenticated());
    // console.log("req.user:", req.user);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing=(req,res,next)=>{
      let {error}= listingSchema.validate(req.body);
   
      if (error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errmsg);
        }else{
        next();
       }
};

module.exports.validateReview=(req,res,next)=>{
      let {error}= reviewSchema.validate(req.body);
   
      if (error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,errmsg);
        }else{
        next();
       }
};


module.exports.isReviewAuthor= async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Reviews.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Author");
        return res.redirect(`/listings/${id}`);
    }
    next();
};