angular.module('meanhotel').controller('HotelsController', HotelsController)

function HotelsController(hotelDataFactory){
	const vm = this
	vm.title = 'MEAN Hotel App'

	hotelDataFactory.hotelList()
		.then(response=>{
			vm.hotels = response
		})
}