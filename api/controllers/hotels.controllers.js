const mongoose = require('mongoose')
const Hotel = mongoose.model('Hotel')

const runGeoQuery = function(req, res) {
	if (isNaN(req.query.lng) || isNaN(req.query.lat)) {
		res
			.status(400)
			.json({
				message: 'If supplied in query string lng and lat must be numbers'
			})
		return
	}

	const lng = parseFloat(req.query.lng)
	const lat = parseFloat(req.query.lat)
	const point = {
		type: 'Point',
		coordinates: [lng, lat]
	}
	const geoOptions = {
		spherical: true,
		maxDistance: 2000,
		num: 5
	}

	Hotel
		.geoNear(point, geoOptions, (err, results, stats) => {

			let response = {
				status: 200,
				message: results
			}

			if (err) {
				response.status = 500
				response.message = err
			} else if (results.length === 0) {
				response.status = 404
				response.message = 'No hotels found in ' + geoOptions.maxDistance + ' meters radious from point [' + lng + ',' + lat + ']'
			}

			res
				.status(response.status)
				.json(response.message)
		})
}



module.exports.hotelsGetAll = function(req, res) {

	let offset = 0
	let count = 5
	const maxCount = 10


	if (req.query && req.query.lat && req.query.lng) {
		runGeoQuery(req, res)
		return
	}

	if (req.query && req.query.offset) {
		offset = parseInt(req.query.offset, 10)
	}

	if (req.query && req.query.count) {
		count = parseInt(req.query.count, 10)
	}

	if (isNaN(offset) || isNaN(count)) {
		res
			.status(400)
			.json({
				message: 'If supplied in query string, count and offset must be integers'
			})
	}

	if (count > maxCount) {
		res
			.status(400)
			.json({
				'message': 'Count limit of ' + maxCount + ' exceeded'
			})
		return
	}

	Hotel
		.find()
		.skip(offset)
		.limit(count)
		.exec((err, hotels) => {
			if (err) {
				res
					.status(500)
					.json(err)
			} else {
				console.log('Found hotels', hotels.length)
				res
					.json(hotels)
			}
		})
}


module.exports.hotelsGetOne = function(req, res) {
	const hotelId = req.params.hotelId
	console.log('GET hotelId', hotelId)

	Hotel
		.findById(hotelId)
		.exec((err, hotel) => {
			let response = {
				status: 200,
				message: hotel
			}

			if (err) {
				response.status = 500
				response.message = err

			} else if (!hotel) {
				response.status = 404
				response.message = {
					'message': 'Hotel ID not found'
				}
			}
			res
				.status(response.status)
				.json(response.message)
		})
}

_splitArray = function(input) {
	let output
	if (input && input.length > 0) {
		output = input.split(';')
	} else {
		output = []
	}
	return output
}

module.exports.hotelsAddOne = function(req, res) {

	Hotel
		.create({
			name: req.body.name,
			description: req.body.description,
			stars: parseInt(req.body.stars, 10),
			services: _splitArray(req.body.services),
			photos: _splitArray(req.body.photos),
			currency: req.body.currency,
			location: {
				address: req.body.address,
				coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
			}
		}, (err, hotel) => {
			console.log('Error creating a new hotel', err)
			if (err) {
				res
					.status(400)
					.json(err)
			} else {
				console.log('New hotel created', hotel)
				res
					.status(201)
					.json(hotel)
			}
		})
}

module.exports.hotelsUpdateOne = function(req, res) {
	const hotelId = req.params.hotelId
	console.log('GET hotelId', hotelId)

	Hotel
		.findById(hotelId)
		.select('-reviews -rooms')
		.exec((err, hotel) => {
			let response = {
				status: 200,
				message: hotel
			}

			if (err) {
				response.status = 500
				response.message = err

			} else if (!hotel) {
				response.status = 404
				response.message = {
					'message': 'Hotel ID not found'
				}
			}

			if (response.status !== 200) {
				res
					.status(response.status)
					.json(response.message)
			} else {
					hotel.name = req.body.name,
					hotel.description = req.body.description,
					hotel.stars = parseInt(req.body.stars, 10),
					hotel.services = _splitArray(req.body.services),
					hotel.photos = _splitArray(req.body.photos),
					hotel.currency = req.body.currency,
					hotel.location = {
						address: req.body.address,
						coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
					}

				hotel.save((err, updatedHotel) => {
					if (err) {
						res
							.status(500)
							.json(err)
					} else {
						res
							.status(204)
							.json( )
					}
				})
			}


		})
}

module.exports.hotelsDeleteOne = function(req, res){
	const hotelId = req.params.hotelId

	Hotel
		.findByIdAndRemove(hotelId)
		.exec((err, hotel) => {
			let response = {
				status: 204,
				message: ''
			}

			if (err) {
				response.status = 500
				response.message = err

			} else if (!hotel) {
				response.status = 404
				response.message = {
					'message': 'Hotel ID not found'
				}
			}
			res
				.status(response.status)
				.json(response.message)
		})	
}
