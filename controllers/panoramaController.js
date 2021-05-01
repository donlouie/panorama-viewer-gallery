const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Panorama = require('../models/panoramaModel');
const { cloudinary } = require('../cloudinary');

//* @route GET
//? @desc Show panorama list
exports.showPanorama = catchAsync(async (req, res, next) => {
  try {
    await Panorama.find({}, (err, doc) => {
      if (!doc) {
        return next(new AppError('No documents found in the database', 404));
      }

      res.status(200).render('panoramas/index', { panoramas: doc });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//* @route GET
//? @desc Render panorama create form
exports.renderNewForm = (req, res, next) => {
  try {
    res.render('panoramas/create');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//* @route POST
//? @desc Create new panorama
exports.createPanorama = catchAsync(async (req, res, next) => {
  try {
    const panorama = new Panorama(req.body.panorama);
    panorama.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    await panorama.save();
    // console.log(panorama);
    req.flash('success_msg', 'Panorama created successfully!');
    res.status(201).redirect('/panoramas');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//* @route GET
//? @desc Show panorama detail
exports.showDetail = async (req, res, next) => {
  try {
    const panorama = await Panorama.findById(req.params.id);
    // console.log(panorama);
    res.status(200).render('panoramas/show', { panorama });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

//* @route DELETE
//? @desc Delete panorama
exports.deletePanorama = async (req, res, next) => {
  try {
    const { id } = req.params;
    const panorama = await Panorama.findById(id);
    cloudinary.uploader.destroy(panorama.images[0].filename);
    await Panorama.findByIdAndDelete(id);
    req.flash('success_msg', 'Panorama deleted successfully!');
    res.status(200).redirect('/panoramas');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
