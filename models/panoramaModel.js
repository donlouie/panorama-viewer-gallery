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
	return this.url.replace('/upload', '/upload/w_4096');
});
/*
other - w_1920
panellum max - w_4096

tiny.jpg      320w,
small.jpg     512w,
medium.jpg    640w,
large.jpg    1024w,
huge.jpg     1280w,
enormous.jpg 2048w
*/

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
