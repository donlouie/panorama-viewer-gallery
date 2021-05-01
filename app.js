const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const panoramaRouter = require('./routes/panoramaRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

//* Routes
app.use('/', userRouter);
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
