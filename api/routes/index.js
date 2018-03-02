const express = require('express')
const router = express.Router()

const ctrlHotels = require('../controllers/hotels.controllers.js')
const ctrlReviews = require('../controllers/reviews.controllers.js')


//HOTEL ROUTES

router
	.route('/hotels')
	.post(ctrlHotels.hotelsAddOne)
	.get(ctrlHotels.hotelsGetAll)

router
	.route('/hotels/:hotelId')
	.get(ctrlHotels.hotelsGetOne)
	.put(ctrlHotels.hotelsUpdateOne)
	.delete(ctrlHotels.hotelsDeleteOne)


//REVIEW ROUTES

router
	.route('/hotels/:hotelId/reviews')
	.post(ctrlReviews.reviewsAddOne)
	.get(ctrlReviews.reviewsGetAll)

router
	.route('/hotels/:hotelId/reviews/:reviewId')
	.get(ctrlReviews.reviewsGetOne)
	.put(ctrlReviews.reviewsUpdateOne)
	.delete(ctrlReviews.reviewsDeleteOne)

module.exports = router