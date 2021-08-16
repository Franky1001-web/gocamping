const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsyncError = require('../utils/catchasync')
const User = require('../models/user');

router.get('/register', (req,res) => {
    res.render('auths/register');
})

router.post('/register', catchAsyncError(async (req,res,next) => {
    try{
        const {username,email,password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser, err => {
        if(err)     return next(err);
        req.flash('success','Welcome to GoCampin')
        res.redirect('/campgrounds')
    })
    // console.log(registeredUser);
    
    } catch(e) {
        req.flash('error',e.message);
        res.redirect('/register')
    }
}) )

router.get('/login', (req,res) => {
    res.render('auths/login')
})

router.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}), async (req,res) => {
    req.flash('success', 'Glad to have you back here')
    const returningUrl = req.session.returnTo || '/campgrounds';
    // delete req.session.returnTo;
    res.redirect(returningUrl)
    // res.send("hello")
})

router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success','Goodbye ')
    res.redirect('/campgrounds');
})

module.exports = router;