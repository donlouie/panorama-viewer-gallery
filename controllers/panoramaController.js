const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Panorama = require('../models/panoramaModel');
const User = require('../models/userModel');
const { cloudinary } = require('../cloudinary');
const { populate } = require('../models/panoramaModel');
const { date } = require('joi');

//* Regex function
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

//! Search query is only displays 3 results
//* @route GET
//? @desc Show client panorama list
exports.showPanorama = catchAsync(async (req, res, next) => {
    try {
        // await Panorama.find({}, (err, doc) => {
        //     if (!doc) {
        //         return next(
        //             new AppError('No documents found in the database', 404)
        //         );
        //     }
        //     res.status(200).render('panoramas/index', { panoramas: doc });
        // });
        //** */
        // const perPage = 3;
        // const page = req.params.page || 1;
        // Panorama.find({})
        //     .skip(perPage * page - perPage)
        //     .limit(perPage)
        //     .exec(function (err, panoramas) {
        //         Panorama.countDocuments().exec(function (err, count) {
        //             if (err) return next(err);
        //             res.render('panoramas/index', {
        //                 panoramas: panoramas,
        //                 current: page,
        //                 pages: Math.ceil(count / perPage),
        //             });
        //         });
        //     });
        //** */
        const perPage = 3;
        const page = req.params.page || 1;
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            Panorama.find({ title: regex })
                .skip(perPage * page - perPage)
                .limit(perPage)
                .exec(function (err, panoramas) {
                    Panorama.countDocuments().exec(function (err, count) {
                        if (err) return next(err);
                        res.render('panoramas/index', {
                            panoramas: panoramas,
                            current: page,
                            pages: Math.ceil(count / perPage),
                        });
                    });
                });
        } else {
            Panorama.find({})
                .skip(perPage * page - perPage)
                .limit(perPage)
                .exec(function (err, panoramas) {
                    Panorama.countDocuments().exec(function (err, count) {
                        if (err) return next(err);
                        res.render('panoramas/index', {
                            panoramas: panoramas,
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

//* @route GET
//? @desc Render panorama info page
exports.renderInfo = catchAsync(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const currentUser = await User.findById(userId);
        // console.log(currentUser.name);
        res.render('panoramas/info', { currentUser: currentUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//* @route GET
//? @desc Render panorama create form
exports.renderNewForm = catchAsync(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const currentUser = await User.findById(userId);
        res.render('panoramas/create', { currentUser: currentUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//* @route GET
//? @desc Render panorama edit form
exports.renderEditForm = catchAsync(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const currentUser = await User.findById(userId);
        const { id } = req.params;
        const panorama = await Panorama.findById(id);
        if (!panorama) {
            req.flash('error', 'Cannot find that panorama!');
            return res.redirect('/panoramas/admin/list');
        }
        res.render('panoramas/edit', { panorama, currentUser: currentUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//* @route GET
//? @desc Render panorama list
exports.renderList = catchAsync(async (req, res, next) => {
    try {
        // const panorama = await Panorama.find({}, (err, doc) => {
        //     if (!doc) {
        //         return next(
        //             new AppError('No documents found in the database', 404)
        //         );
        //     }
        // }).populate('author');
        // res.status(200).render('panoramas/list', { panoramas: panorama });
        const userId = req.user._id;
        const currentUser = await User.findById(userId);
        const perPage = 5;
        const page = req.params.page || 1;
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            Panorama.find({ title: regex })
                .populate('author')
                .skip(perPage * page - perPage)
                .limit(perPage)
                .exec(function (err, panoramas) {
                    Panorama.countDocuments().exec(function (err, count) {
                        if (err) return next(err);
                        res.render('panoramas/list', {
                            panoramas: panoramas,
                            currentUser: currentUser,
                            current: page,
                            pages: Math.ceil(count / perPage),
                        });
                    });
                });
        } else {
            const userId = req.user._id;
            const currentUser = await User.findById(userId);
            Panorama.find({})
                .populate('author')
                .skip(perPage * page - perPage)
                .limit(perPage)
                .exec(function (err, panoramas) {
                    Panorama.countDocuments().exec(function (err, count) {
                        if (err) return next(err);
                        res.render('panoramas/list', {
                            panoramas: panoramas,
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
//? @desc Create new panorama
exports.createPanorama = catchAsync(async (req, res, next) => {
    try {
        const panorama = new Panorama(req.body.panorama);
        panorama.images = req.files.map((f) => ({
            url: f.path,
            filename: f.filename,
        }));
        panorama.author = req.user._id;
        await panorama.save();
        // console.log(panorama);
        req.flash('success_msg', 'Panorama created successfully!');
        res.status(201).redirect('/panoramas/admin/list/1');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//* @route GET
//? @desc Show panorama detail
exports.showDetail = catchAsync(async (req, res, next) => {
    try {
        const panorama = await Panorama.findById(req.params.id)
            // console.log(panorama);
            .populate('author');
        res.status(200).render('panoramas/show', { panorama });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//* @route PUT
//? @desc Update panorama
exports.updatePanorama = catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;
        authorId = req.user._id;
        const panorama = await Panorama.findByIdAndUpdate(id, {
            ...req.body.panorama,
            author: authorId,
            date: Date.now(),
        });
        const imgs = req.files.map((f) => ({
            url: f.path,
            filename: f.filename,
        }));
        panorama.images.push(...imgs);
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                cloudinary.uploader.destroy(filename);
            }
            await panorama.updateOne({
                $pull: { images: { filename: { $in: req.body.deleteImages } } },
            });
            console.log(panorama);
        }
        await panorama.save();
        req.flash('success_msg', 'Panorama updated successfully!');
        res.status(200).redirect('/panoramas/admin/list/1');
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
        res.status(200).redirect('/panoramas/admin/list/1');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
