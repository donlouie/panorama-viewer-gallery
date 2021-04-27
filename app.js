const express = require('express');
const bodyParser = require('body-parser');

const panoramaRouter = require('./routes/panoramaRoutes');

const AppError = require('./utils/appError');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/', panoramaRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
