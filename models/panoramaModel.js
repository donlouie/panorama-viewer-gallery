const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String,
});

const panoramaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Panorama must have a Title'],
  },
  location: {
    type: String,
    required: [true, 'Panorama must have a Location'],
  },
  description: {
    type: String,
    required: [true, 'Panorama must have a Description'],
  },
  images: [imageSchema],
  date: { type: Date, default: Date.now },
});

const Panorama = mongoose.model('Panorama', panoramaSchema);

module.exports = Panorama;
