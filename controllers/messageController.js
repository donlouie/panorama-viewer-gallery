const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const nodeMailer = require('nodemailer');

const Message = require('../models/messageModel');

//* Nodemailer Config

//* @route GET
//? @desc Render panorama info page
exports.renderNewForm = catchAsync(async (req, res, next) => {
    try {
        res.render('messages/create');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
