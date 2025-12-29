const listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req,res) => {
   
    console.log(await listing.findById(req.params.id));
    let listingg= await listing.findById(req.params.id);
    
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listingg.reviews.push(newReview);

    await newReview.save();
    await listingg.save();
    req.flash("success","New Review Created!");

    res.redirect(`/listings/${listingg._id}`);
};

module.exports.destoryReview=async (req,res) => {
    let {id, reviewId}= req.params ;
    console.log(req.params);
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
 };