const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

const panoramaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  images: [imageSchema],
});

const Panorama = mongoose.model('Panorama', panoramaSchema);

module.exports = Panorama;
