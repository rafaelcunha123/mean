angular.module('meanhotel').controller('HotelController', HotelController)

function HotelController($route, $routeParams, hotelDataFactory){
	const vm  = this
	const id = $routeParams.id

	hotelDataFactory.hotelDisplay(id)
		.then(response => {
			console.log(response)
			vm.hotel = response
			vm.stars = _getStarRating(response.stars)
		})

	function _getStarRating(stars){
		return new Array(stars);
	}

	vm.addReview = function(){
		const postData = {
			name: vm.name,
			rating: vm.rating,
			review: vm.review
		}
		if(vm.reviewForm.$valid){
			hotelDataFactory.postReview(id, postData)
				.then(response=>{
					if(response.status= 200){
						$route.reload()
					}
				})
				.catch(error=>{
					console.log(error)
				})
		} else {
			vm.isSubmitted = true
		}
	}
}



