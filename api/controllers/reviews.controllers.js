const mongoose = require('mongoose')
const Hotel = mongoose.model('Hotel')
	//const Review = mongoose.model('Review')

//GET ALL REVIEWS FOR A HOTEL
module.exports.reviewsGetAll = function(req, res) {
	const hotelId = req.params.hotelId
	console.log('GET hotelId', hotelId)

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec((err, hotel) => {

			let response = {
				status: 200,
				message: []
			}

			if (err) {
				response.status = 500
				response.message = err

			} else if (!hotel) {
				response.status = 404
				response.message = {
					'message': 'Hotel ID not found'
				}
			} else {
				response.message = hotel.reviews ? hotel.reviews : []
			}
			res
				.status(response.status)
				.json(response.message)
		})
}

module.exports.reviewsGetOne = function(req, res) {
	const hotelId = req.params.hotelId
	const reviewId = req.params.reviewId
	console.log('GET the reviewId', reviewId, 'for hotelId', hotelId)

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec((err, hotel) => {

			let response = {
				status: 200,
				message: []
			}

			if (err) {
				response.status = 500
				response.message = err

			} else if (!hotel) {
				response.status = 404
				response.message = {
					'message': 'Hotel ID not found'
				}
			} else if (!hotel.reviews.id(reviewId)) {
				response.status = 404,
					response.message = 'Review ID not found'
			} else {
				response.message = hotel.reviews.id(reviewId)
			}

			res
				.status(response.status)
				.json(response.message)
		})
}

_addReview = function(req, res, hotel) {
	hotel.reviews.push({
		name: req.body.name,
		rating: parseInt(req.body.rating, 10),
		review: req.body.review,
	})

	hotel.save((err, hotelUpdated) => {
		if (err) {
			res
				.status(500)
				.json(err)
		} else {
			res
				.status(201)
				.json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1])
		}
	})
}

module.exports.reviewsAddOne = function(req, res) {
	const hotelId = req.params.hotelId
	console.log('GET hotelId', hotelId)

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec((err, hotel) => {

			let response = {
				status: 200,
				message: []
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

			if (hotel) {
				_addReview(req, res, hotel)
			} else {
				res
					.status(response.status)
					.json(response.message)
			}

		})
}

module.exports.reviewsUpdateOne = function(req, res) {
	const hotelId = req.params.hotelId
	const reviewId = req.params.reviewId
	console.log('GET hotelId', hotelId)

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec((err, hotel) => {

			let response = {
				status: 200,
				message: []
			}

			if (err) {
				response.status = 500
				response.message = err

			} else if (!hotel) {
				response.status = 404
				response.message = {
					'message': 'Hotel ID not found'
				}
			} else if (!hotel.reviews.id(reviewId)) {
				response.status = 404,
					response.message = 'Review ID not found'
			}

			if (response.status !== 200) {
				res
					.status(response.status)
					.json(response.message)
			} else {
				let review = hotel.reviews.id(reviewId)
				review.name = req.body.name
				review.rating = req.body.rating
				review.review = req.body.review

				hotel.save((err, updatedHotel) => {
					if (err) {
						res
							.status(500)
							.json(err)
					} else {
						res
							.status(204)
							.json()
					}
				})
			}
		})
}

module.exports.reviewsDeleteOne = function(req, res){
	const hotelId = req.params.hotelId
	const reviewId = req.params.reviewId
	console.log('GET hotelId', hotelId)

	Hotel
		.findById(hotelId)
		.select('reviews')
		.exec((err, hotel) => {

			let response = {
				status: 200,
				message: []
			}

			if (err) {
				response.status = 500
				response.message = err

			} else if (!hotel) {
				response.status = 404
				response.message = {
					'message': 'Hotel ID not found'
				}
			} else if (!hotel.reviews.id(reviewId)) {
				response.status = 404,
					response.message = 'Review ID not found'
			}

			if (response.status !== 200) {
				res
					.status(response.status)
					.json(response.message)
			} else {
				hotel.reviews.id(reviewId).remove()
				hotel.save((err, updatedHotel) => {
					if (err) {
						res
							.status(500)
							.json(err)
					} else {
						res
							.status(204)
							.json()
					}
				})
			}
		})	
}