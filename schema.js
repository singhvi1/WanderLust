const joi=require('joi');

module.exports.listingSchema=joi.object({
    listing:joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().allow("",null),
        category: joi.string().valid(
            "Trending",
            "Rooms",
            "Mountains",
            "Iconic cities",
            "Fort-awesome",
            "Amazing Pool",
            "Camping",
            "Farms",
            "Rain",
            "Arctic"
        )
    }).required()
})
// module.exports=listingSchema;

//for reviews:

module.exports.reviewSchema=joi.object({
    review :joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()
    }).required()
}).required();