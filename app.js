const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const panoramaRouter = require('./routes/panoramaRoutes');

const AppError = require('./utils/appError');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use('/', panoramaRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
