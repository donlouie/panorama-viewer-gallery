const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Panorama = require('../models/panoramaModel');
const { cloudinary } = require('../cloudinary');
const { populate } = require('../models/panoramaModel');
const { date } = require('joi');

//* @route GET
//? @desc Show panorama list
exports.showPanorama = catchAsync(async (req, res, next) => {
    try {
        await Panorama.find({}, (err, doc) => {
            if (!doc) {
                return next(
                    new AppError('No documents found in the database', 404)
                );
            }
            res.status(200).render('panoramas/index', { panoramas: doc });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//* @route GET
//? @desc Render panorama info page
exports.renderInfo = catchAsync(async (req, res, next) => {
    try {
        res.render('panoramas/info');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//* @route GET
//? @desc Render panorama create form
exports.renderNewForm = catchAsync(async (req, res, next) => {
    try {
        res.render('panoramas/create');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//* @route GET
//? @desc Render panorama edit form
exports.renderEditForm = catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;
        const panorama = await Panorama.findById(id);
        if (!panorama) {
            req.flash('error', 'Cannot find that panorama!');
            return res.redirect('/panoramas/admin/list');
        }
        res.render('panoramas/edit', { panorama });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//* @route GET
//? @desc Render panorama list
exports.renderList = catchAsync(async (req, res, next) => {
    try {
        // await Panorama.find({}, (err, doc) => {
        //     if (!doc) {
        //         return next(
        //             new AppError('No documents found in the database', 404)
        //         );
        //     }
        //     res.status(200).render('panoramas/modify', { panoramas: doc });
        // });
        const panorama = await Panorama.find({}, (err, doc) => {
            if (!doc) {
                return next(
                    new AppError('No documents found in the database', 404)
                );
            }
        }).populate('author');
        res.status(200).render('panoramas/list', { panoramas: panorama });
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
        res.status(201).redirect('/panoramas/admin/list');
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
    const { id } = req.params;
    console.log(req.body);
    const panorama = await Panorama.findByIdAndUpdate(id, {
        ...req.body.panorama,
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
    req.flash('success', 'Successfully updated panorama!');
    res.redirect('/panoramas/admin/list');
});

//* @route POST
//? @desc Delete panorama
exports.deletePanorama = catchAsync(async (req, res, next) => {
    try {
        const { id } = await Panorama.findById(req.body.deleteButton);
        const panorama = await Panorama.findById(id);
        cloudinary.uploader.destroy(panorama.images[0].filename);
        await Panorama.findByIdAndDelete(id);
        //! Flash message not shown after delete
        req.flash('success_msg', 'Panorama deleted successfully!');
        res.status(200).redirect('/panoramas/admin/list');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
