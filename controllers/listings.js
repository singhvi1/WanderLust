const Listing = require("../models/listing.js");
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const { config, geocoding } = require("@maptiler/client");
config.apiKey = process.env.MAP_TOKEN;

//Index Route;
module.exports.index=async (req, res) => {
  const {category, search}=req.query;
  let query={};
  if(category){
    query.category=category;    
  }
  if(search){
    query.location={ $regex: search, $options: 'i' };   
  }
  const allListing=await Listing.find(query);
  // let allListing;
  // if(category){
  //   allListing=await Listing.find({category});
  // }else{
  //   allListing=await Listing.find({});
  // }
  res.render("listings/index.ejs",{allListing, category, search})

  /*const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });*/
}
  

  //new Route
module.exports.renderNewForm=(req, res) => {
  res.render("listings/new.ejs");
}

//show route
module.exports.showListings=(async (req, res) => {
    let { id } = req.params;
    // const listing = await Listing.findById(id).populate("reviews").populate("owner");
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
      populate:{
        path:"author"
      }})//nested populate
    .populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for dows not exist !");
      return res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });
  });

  //create 
  module.exports.createListings=async (req, res, next) => {
      const response = await geocoding.forward(req.body.listing.location, { limit: 1 });
      console.log(response.features[0].geometry.coordinates)
      let url=req.file.path;
      let filename=req.file.filename;
      // console.log(url , "....and ...",filename);
      // console.log("BODY:", req.body);

      const newListing = new Listing(req.body.listing);
      newListing.image={url,filename}
      newListing.geometry=response.features[0].geometry;
      newListing.owner=req.user._id;
      await newListing.save();
      

      req.flash("success","New listing created !");
      res.redirect("/listings");
    };


//Edit route
module.exports.renderEditForm=async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if(!listing){
        req.flash("error","Listing you requested for does not exist !");
        return res.redirect("/listings");
      }
      if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","you dont have permission to edit")
      return res.redirect(`/listings/${id}`);
    }
      let originalImageUrl=listing.image.url;
      originalImageUrl=originalImageUrl.replace("/upload","/upload/w_150")
      console.log(originalImageUrl)
      res.render("listings/edit.ejs", { listing ,originalImageUrl});
    };

//Update Form
  module.exports.updateListing=async (req, res) => {
      let { id } = req.params; // deconstrut
      let listing=await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
      if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","you dont have permission to edit")
      return res.redirect(`/listings/${id}`);}
      if(typeof req.file!=="undefined"){//to check ? whetere there is image or not 
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
      }
      req.flash("success","listing updated");
      res.redirect(`/listings/${id}`);
    };
  
  
//delete route
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted");
    res.redirect("/listings");
  };  
