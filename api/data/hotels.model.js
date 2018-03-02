const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	rating: {
		type: Number,
		min: 1,
		max: 5,
		'default': 0,
	},
	review: {
		type: String,
		required: true,
	},
	createdOn: {
		type: Date,
		'default': Date.now,
	},
})

const roomSchema = mongoose.Schema({
	type: String,
	number: Number,
	description: String,
	photos: [String],
	price: Number,
})


const hotelSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	stars: {
		type: Number,
		min: 1,
		max: 5,
		'default': 0,
	},
	currency: String,
	description: String,
	services: [String],
	reviews: [reviewSchema],
	rooms: [roomSchema],
	location: {
		address: String,
		coordinates: {
			type: [Number],
			index: '2dsphere'
		}, //always store coordinates in longitude latitude order
	}
})

mongoose.model('Hotel', hotelSchema, 'hotels')