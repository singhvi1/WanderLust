const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");


const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });
//serverside validation for listing and reviews  :

//Index Route;
//create route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListings)
  );

//new Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//update route
//delete route;
//show route;

router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIn, 
    isOwner,
    upload.single("listing[image]"),//upload image from edit.ejs->multer->cloudinary->req.file->cntro-> db
    validateListing, 
    wrapAsync(listingController.updateListing))//calling the controllers 
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route;
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
