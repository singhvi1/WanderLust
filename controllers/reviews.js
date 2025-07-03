const Listing = require("../models/listing.js"); // Add this line
const Review = require("../models/review.js"); // Add this line


module.exports.createReview=async (req,res)=>{
  let listing=await Listing.findById(req.params.id).populate("reviews");
  console.log(req.body.review)
  if (!req.body.review) {
    throw new ExpressError(400, "Invalid Review Data");F   
  }
  let newReview=new Review(req.body.review);
  newReview.author=req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview._id); 
  await newReview.save();
  await listing.save();
  console.log(listing); 
  // res.redirect(`/listings/${listing._id}`)
  req.flash("success","New Review Created!");
  res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyReview=async(req,res)=>{
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
};