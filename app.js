if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
//Packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSanitizer = require('express-sanitizer');

//Models
const expressError = require('./utils/ExpressError');
const user = require('./models/user');

//Routers
const campground_router = require('./routers/campground');
const review_router = require('./routers/review');
const register_router = require('./routers/users');

const dbURL = process.env.DB_URL;

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then((res) => console.log("db is connected"))
  .catch((err) => console.log(err));

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret: "itssecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
app.use(expressSanitizer());

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next) => {
    // console.log(req.session)
    res.locals.loggedInUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', register_router);
app.use('/campgrounds', campground_router);
app.use('/campgrounds/:id/review', review_router);

//here are the routes
app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (req,res,next) => {
    next(new expressError('Error 404!!! what you are looking for is not here', 404));
})

app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh shit there is some problem"
    res.status(statusCode).render('error_temp',{err});
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})