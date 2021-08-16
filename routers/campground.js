const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsyncError = require('../utils/catchasync');
const {validateData,checkLogin,verifyAuthor } = require('../middleware')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })
const {cloudinary} = require('../cloudinary')
const geocode = require('@mapbox/mapbox-sdk/services/geocoding')
const mboxToken = process.env.MAPBOX_TOKEN;
const geocoder = geocode({accessToken: mboxToken});

router.get('', catchAsyncError(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));


router.get('/new',checkLogin, (req, res) => {
    res.render('campgrounds/new');
})

router.post('',checkLogin, upload.array('image') ,validateData, catchAsyncError( async (req, res, next) => {
    // if(!req.body.campground)    throw new expressError("invalid campground data", 400)    
    const loc = await geocoder.forwardGeocode(
        {
            query: req.body.campground.location,
            limit: 1
        }
    ).send();
    console.log(loc.body.features[0].geometry)
    const campground = new Campground(req.body.campground);
    campground.mapping=loc.body.features[0].geometry;
    campground.images=req.files.map(obj => ({url: obj.path, fileName: obj.filename}))
    campground.owner = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success', "Successfully made a new campsite");
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsyncError(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({path: 'reviews',populate:{path: 'owner'}}).populate('owner');
    // console.log(campground)  
    if(!campground){
        req.flash('error','Sorry can not find any campground like this')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit',checkLogin,verifyAuthor, catchAsyncError(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','Sorry can not find any campground like this')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}))


router.put('/:id',checkLogin,verifyAuthor,upload.array('image'),validateData, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    console.log(req.body,req.files)
    const imgs=req.files.map(obj => ({url: obj.path, fileName: obj.filename}));
    campground.images.push(...imgs)
    await campground.save();
    if(req.body.deleteImages){
        for(let fileName of req.body.deleteImages){
            await cloudinary.uploader.destroy(fileName);
        }
        await campground.updateOne({$pull : {images: {fileName: {$in: req.body.deleteImages}}}})
        console.log(campground)
    }
    console.log(req.body.deleteImages)
    req.flash('success', 'successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}));


router.delete('/:id',checkLogin,verifyAuthor, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground')
    res.redirect('/campgrounds');
}))

module.exports = router;