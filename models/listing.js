const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },

  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,

  reviews:[
    {
    type:Schema.Types.ObjectId,
    ref:"Review" 
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'], // Must be 'Point' for geoJSON compatibility
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Mountains",
      "Iconic cities",
      "Fort-awesome",
      "Amazing Pool",
      "Camping",
      "Farms",
      "Arctic"
    ],
  }

});


//for handling Listing.js -> 10.53

listingSchema.post("findOneAndDelete",async (listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})//check each review and delete wherever _id of listing store ;
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
