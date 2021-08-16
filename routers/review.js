const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsyncError = require('../utils/catchasync');
const {validateReview,checkLogin,verifyReviewAuthor}=require('../middleware');

router.post('/', checkLogin, validateReview, catchAsyncError(async(req,res) => {
    // res.send("Thanks for your valuable reviews!!");
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Thanks for the review')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId',checkLogin,verifyReviewAuthor, catchAsyncError(async (req,res) => {
    // res.send("Deleted review");
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;