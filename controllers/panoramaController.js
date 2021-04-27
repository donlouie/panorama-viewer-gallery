const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Panorama = require('../models/panoramaModel');
const { cloudinary } = require('../cloudinary');

exports.showPanorama = catchAsync(async (req, res, next) => {
  try {
    await Panorama.find({}, (err, doc) => {
      if (!doc) {
        return next(new AppError('No documents found in the database', 404));
      }

      res.status(200).render('index', { panoramas: doc });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

exports.renderNewForm = (req, res) => {
  res.render('create');
};

exports.createPanorama = catchAsync(async (req, res, next) => {
  try {
    const panorama = new Panorama(req.body.panorama);
    panorama.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    await panorama.save();
    res.redirect('/');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

exports.showDetail = async (req, res) => {
  const panorama = await Panorama.findById(req.params.id);
  if (!panorama) {
    return res.redirect('/');
  }
  res.render('show', { panorama });
};
