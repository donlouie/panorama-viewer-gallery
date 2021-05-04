const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const { ensureAuthenticated } = require('../config/auth');

const Panorama = require('../models/panoramaModel');
const panoramaController = require('../controllers/panoramaController');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//* @route GET
//? @desc Show panorama list
router.route('/').get(panoramaController.showPanorama);

//* @route GET
//? @desc Render info page
router.route('/info').get(ensureAuthenticated, panoramaController.renderInfo);

//* @route GET
//? @desc Render panorama create form
//* @route POST
//? @desc Create new panorama
router
  .route('/create')
  .get(ensureAuthenticated, panoramaController.renderNewForm)
  .post(upload.array('image'), panoramaController.createPanorama);

//* @route GET
//? @desc Show panorama detail
//* @route DELETE
//? @desc Delete panorama
router
  .route('/:id')
  .get(panoramaController.showDetail)
  // .delete(panoramaController.deletePanorama);

module.exports = router;
