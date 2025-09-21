const Listing=require("../models/listing");
const axios = require("axios");

module.exports.index=async(req,res)=>{
    const AllListings=await Listing.find({});
    res.render("listings/index.ejs",{AllListings});
    }

module.exports.newFormRender=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
     let {id}=req.params;
     const listing=await Listing.findById(id)
     .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
    })
     .populate("owner");
     if (!listing){
          req.flash("error","listing you requested for does not exist!"); 
          res.redirect("/listings");
     }
    //  console.log(listing);
    // Render with latitude and longitude fallback
    res.render("listings/show.ejs", {
        listing,
        mapData: {
    lat: listing.latitude || 28.6139,
    lng: listing.longitude || 77.2090,
    title: listing.title
  }
    });
 }


// module.exports.createListing=async(req,res,next)=>{
//    let url =req.file.path;
//    let filename=req.file.filename;
//    console.log(url,"..",filename);
//     const newListing= new Listing(req.body.listing);
//     newListing.owner=req.user._id;
//     newListing.image={url,filename};
//     await newListing.save();
//     req.flash("success","New Listing Created");
//     res.redirect("/listings");
    
    
// }



async function getCoordinates(location) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${process.env.OPENCAGE_KEY}`;
    const response = await axios.get(url);
    if (response.data.results.length > 0) {
        return {
            lat: response.data.results[0].geometry.lat,
            lng: response.data.results[0].geometry.lng
        };
    }
    return null;
}

module.exports.createListing = async (req, res, next) => {
    try {
        if (!req.file || !req.body.listing) {
            req.flash("error", "Image or Listing data is missing.");
            return res.redirect("/listings/new");
        }

        const { location } = req.body.listing;
        const coords = await getCoordinates(location);  // 🌍 Get lat/lng

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url: req.file.path, filename: req.file.filename };
        if (coords) {
            newListing.latitude = coords.lat;
            newListing.longitude = coords.lng;
        }

        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect(`/listings/${newListing._id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong while creating listing.");
        res.redirect("/listings/new");
    }
};


module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if (!listing){
          req.flash("error","listing you requested for does not exist!"); 
          res.redirect("/listings");
     }
     let originalImageUrl=listing.image.url;
     originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
    
    let {id}=req.params;
    id = id.trim();
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});

   if (req.body.listing.location) {
        const coords = await getCoordinates(req.body.listing.location);
        if (coords) {
            listing.latitude = coords.lat;
            listing.longitude = coords.lng;
        }
    }


   if(typeof req.file !== "undefined"){
   let url =req.file.path;
   let filename=req.file.filename;
   listing.image={url,filename};
   await listing.save();
   }
   await listing.save();
    req.flash("success"," Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async(req,res)=>{
   let {id}=req.params;
   const deletedlisting= await Listing.findByIdAndDelete(id);
   console.log(deletedlisting);
   req.flash("success"," Listing Deleted");
   res.redirect("/listings");
}