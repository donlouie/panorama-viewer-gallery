const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const nodeMailer = require('nodemailer');

const User = require('../models/userModel');
const Message = require('../models/messageModel');

//* Nodemailer config
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

//* Nodemailer Config
const user = process.env.EMAIL;
const password = process.env.PASSWORD;

//* Regex function
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

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
		// const message = await Message.find({}, (err, doc) => {
		//     if (!doc) {
		//         return next(
		//             new AppError('No documents found in the database', 404)
		//         );
		//     }
		// });
		// res.status(200).render('messages/list', { messages: message });
		const userId = req.user._id;
		const currentUser = await User.findById(userId);
		const perPage = 10;
		const page = req.params.page || 1;
		if (req.query.search) {
			const regex = new RegExp(escapeRegex(req.query.search), 'gi');
			Message.find({ title: regex })
				.populate('author')
				.skip(perPage * page - perPage)
				.limit(perPage)
				.exec(function (err, messages) {
					Message.countDocuments().exec(function (err, count) {
						if (err) return next(err);
						res.render('messages/list', {
							messages: messages,
							currentUser: currentUser,
							current: page,
							pages: Math.ceil(count / perPage),
						});
					});
				});
		} else {
			const userId = req.user._id;
			const currentUser = await User.findById(userId);
			Message.find({})
				.populate('author')
				.skip(perPage * page - perPage)
				.limit(perPage)
				.exec(function (err, messages) {
					Message.countDocuments().exec(function (err, count) {
						if (err) return next(err);
						res.render('messages/list', {
							messages: messages,
							currentUser: currentUser,
							current: page,
							pages: Math.ceil(count / perPage),
						});
					});
				});
		}
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
		res.status(200).redirect('/messages/admin/list/1');
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// //* @route POST
// //? @desc Delete panorama
exports.deletePanorama = catchAsync(async (req, res, next) => {
	try {
		const { id } = await Panorama.findById(req.body.deleteButton);
		const panorama = await Panorama.findById(id);
		cloudinary.uploader.destroy(panorama.images[0].filename);
		await Panorama.findByIdAndDelete(id);
		req.flash('success_msg', 'Panorama deleted successfully!');
		res.status(200).redirect('/panoramas/admin/list/1');
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//* If sending message doesn't work. Allow permission from this link.
// https://accounts.google.com/b/0/DisplayUnlockCaptcha
exports.sendEmail = catchAsync(async (req, res, next) => {
	try {
		const transporter = nodeMailer.createTransport({
			service: 'gmail',
			auth: {
				user: user,
				pass: password,
			},
		});
		const mailOptions = {
			from: user,
			to: req.body.to,
			subject: req.body.title,
			text: req.body.body,
		};
		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				console.log(mailOptions);
				console.log(err);
			} else {
				console.log(info.response);
				req.flash('success_msg', 'Email Sent Successfully');
				res.redirect('/messages/admin/list/1');
			}
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});
