const expressError = require('./utils/ExpressError');
const {dataSchema,reviewSchema} = require('./validation_schema')
const Campground = require('./models/campground');
const Review = require('./models/review')

//Reviews
module.exports.validateReview = (req,res,next) => {

    const {err} = reviewSchema.validate(req.body);
    if(err){
        const message = err.details.map(ele => ele.message).join(',');
        throw new expressError(message, 400);
    }
    else next();
}

module.exports.verifyReviewAuthor = async(req,res,next) => {
    const {id,reviewId}=req.params;
    const review = await Review.findById(reviewId);
    if(!review.owner.equals(req.user._id)){
        req.flash('error','Sorry You do not have the permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}


//Campground
module.exports.validateData = (req,res,next) => {

    const {err} = dataSchema.validate(req.body);
    if(err){
        const message = err.details.map(ele => ele.message).join(',');
        throw new expressError(message, 400);
    }
    else next();
}

module.exports.checkLogin = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','You need to be logged in');
       return res.redirect('/login')
    }
    next();
}

module.exports.verifyAuthor = async(req,res,next) => {
    const id=req.params.id;
    const campground = await Campground.findById(id);
    if(!campground.owner.equals(req.user._id)){
        req.flash('error','Sorry You do not have the permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

