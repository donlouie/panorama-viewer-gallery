const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Panorama = require('../models/panoramaModel');
const { cloudinary } = require('../cloudinary');

//* Show Panorama List
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

//* Render Panorama Create Form
exports.renderNewForm = (req, res) => {
  res.render('create');
};

//* Create Panorama
exports.createPanorama = catchAsync(async (req, res, next) => {
  try {
    const panorama = new Panorama(req.body.panorama);
    panorama.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    await panorama.save();
    console.log(panorama);
    res.redirect('/');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//* Show Panorama Detail
exports.showDetail = async (req, res) => {
  const panorama = await Panorama.findById(req.params.id);
  if (!panorama) {
    return res.redirect('/');
  }
  res.render('show', { panorama });
};

//* Delete Panorama
// exports.deletePanorama = async (req, res) => {
//   const { id } = req.params;
//   await Panorama.findByIdAndDelete(id);
//   res.redirect('/');
// };

exports.deletePanorama = async (req, res) => {
  const { id } = req.params;
  const panorama = await Panorama.findById(id);
  console.log(panorama);
  console.log(panorama.images[0].filename);
  cloudinary.uploader.destroy(panorama.images[0].filename);
  await Panorama.findByIdAndDelete(id);
  res.redirect('/');
};
