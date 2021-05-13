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

//* @route POST
//? @desc Create new message
exports.createMessage = catchAsync(async (req, res, next) => {
    try {
        const message = new Message(req.body.message);
        await message.save();
        req.flash('success_msg', 'Message sent successfully!');
        res.status(201).redirect('/messages/create');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// //* @route POST
// //? @desc Create new panorama
// exports.createPanorama = catchAsync(async (req, res, next) => {
//     try {
//         const panorama = new Panorama(req.body.panorama);
//         panorama.images = req.files.map((f) => ({
//             url: f.path,
//             filename: f.filename,
//         }));
//         panorama.author = req.user._id;
//         await panorama.save();
//         // console.log(panorama);
//         req.flash('success_msg', 'Panorama created successfully!');
//         res.status(201).redirect('/panoramas/admin/list');
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });
