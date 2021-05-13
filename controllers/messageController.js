const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const nodeMailer = require('nodemailer');

const Message = require('../models/messageModel');

//* Nodemailer Config

//* @route GET
//? @desc Render message create form
exports.renderNewForm = catchAsync(async (req, res, next) => {
    try {
        res.render('messages/create');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//* @route GET
//? @desc Render message list
exports.renderList = catchAsync(async (req, res, next) => {
    try {
        const message = await Message.find({}, (err, doc) => {
            if (!doc) {
                return next(
                    new AppError('No documents found in the database', 404)
                );
            }
        });
        res.status(200).render('messages/list', { messages: message });
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

//* @route POST
//? @desc Delete message
exports.deleteMessage = catchAsync(async (req, res, next) => {
    try {
        const { id } = await Message.findById(req.body.deleteButton);
        await Message.findByIdAndDelete(id);
        req.flash('success_msg', 'Message deleted successfully!');
        res.status(200).redirect('/messages/admin/list');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//* @route POST
//? @desc Delete panorama
exports.deletePanorama = catchAsync(async (req, res, next) => {
    try {
        const { id } = await Panorama.findById(req.body.deleteButton);
        const panorama = await Panorama.findById(id);
        cloudinary.uploader.destroy(panorama.images[0].filename);
        await Panorama.findByIdAndDelete(id);
        req.flash('success_msg', 'Panorama deleted successfully!');
        res.status(200).redirect('/panoramas/admin/list');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
