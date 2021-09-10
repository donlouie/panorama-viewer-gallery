const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
	url: String,
	filename: String,
});

//* Virtual thumbnail
imageSchema.virtual('thumbnail').get(function () {
	return this.url.replace('/upload', '/upload/w_200');
});
//* Virtual preview
// imageSchema.virtual('preview').get(function () {
//     return this.url.replace('/upload', '/upload/w_512');
// });
//* Virtual pannellum preview
imageSchema.virtual('panorama').get(function () {
	return this.url.replace('/upload', '/upload/w_1920');
});

const panoramaSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Panorama must have a Title'],
	},
	//   campus: {
	// 	  type: String,
	// 	  required: [true, 'Panorama must have a Campus'],
	//   },
	location: {
		type: String,
		required: [true, 'Panorama must have a Location'],
	},
	description: {
		type: String,
		required: [true, 'Panorama must have a Description'],
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	images: [imageSchema],
	date: { type: Date, default: Date.now },
});

const Panorama = mongoose.model('Panorama', panoramaSchema);

module.exports = Panorama;
