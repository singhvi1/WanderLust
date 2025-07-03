const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js")

//review route: -> post review  route; now validate review with wrapAsync fore error;

router.post("/",validateReview,isLoggedIn, wrapAsync(reviewController.createReview));

//Delete Route : => Delete review Route:
router.delete("/:reviewId",isReviewAuthor,
  wrapAsync(reviewController.destroyReview));

module.exports=router;