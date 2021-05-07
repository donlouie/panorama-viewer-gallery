const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const AppError = require('./utils/appError');

//* Routes
const panoramaRouter = require('./routes/panoramaRoutes');
const userRouter = require('./routes/userRoutes');

//* Authentication modules
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
//*Passport config
require('./config/passport')(passport);

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

//*Express session
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

//* Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//* Connect flash
app.use(flash());
//* Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//* Routes
app.use('/users', userRouter);
app.use('/panoramas', panoramaRouter);

//* @route GET
//? @desc Render home page
app.get('/', (req, res) => {
    res.render('home');
});

//* @route ALL
//? @desc ERROR 404 Page
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
