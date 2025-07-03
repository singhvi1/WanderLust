const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js"); //never forget
const Review=require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
  // console.log(req.user);//store all info regarding user
  console.log(req.path , " .. ", req.originalUrl);
    if(!req.isAuthenticated()){ //login
      req.session.redirectUrl=req.originalUrl; //saving path user want 
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");
      }
      next();
};
module.exports.saveRedirectUrl=(req , res, next)=>{  //saving to locals ? 
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl
  }
  next();
}


// creating middelware for autherization : 


module.exports.isOwner=async (req,res,next)=>{
  let { id } = req.params; // deconstrut
  let listing=await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","you dont have permission to edit")
    return res.redirect(`/listings/${id}`);
  }
  next();
}


module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let errMsg = error.details.map((er) => er.message).join(",");
    console.log(errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


//-> make the reviws route validate :

module.exports.validateReview=(req,res,next)=>{
  let{error}=reviewSchema.validate(req.body);
  console.log(error);
  if(error){
    let errMsg=error.details.map((er)=>er.message).join(",")
    console.log(errMsg)
    throw new ExpressError(400,errMsg)
  }else{
    next()
  }
}

module.exports.isReviewAuthor=async (req,res,next)=>{
  let {id, reviewId } = req.params; // deconstrut
  let review=await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","you dont have permission to Delete")
    return res.redirect(`/listings/${id}`);
  }
  next();
}
