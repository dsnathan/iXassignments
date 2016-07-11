var app = angular.module('moviesApp', ['ngRoute']); 

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'MainCtrl',
		templateUrl: 'templates/home.html',
	})
	$routeProvider.when('/movie/:movieId', {
		controller: 'MovieCtrl',
		templateUrl: 'templates/movies.html',
	})
});

app.controller('MainCtrl',function($scope, $http) {
//make a function here
	$scope.searchMovies = function(){
		$http({
			url: "http://www.omdbapi.com/?",
			method: "GET",
			params: {
				s: $scope.search
			}
		}).then(function(response){
			console.log(response);
			$scope.movieArray = response.data.Search;
		})
	};
});

app.controller('MovieCtrl', function($scope, $http, $routeParams) {
	$http({
		url: "http://www.omdbapi.com/?",
		method: "GET", 
		params: { 
			i: $routeParams.movieId
		}
	
	}).then(function(response){ 
		console.log(response);
		$scope.movie = response.data;

		$http({
			url: 'http://api.giphy.com/v1/gifs/search',
			method: 'GET',
			params: {
				q: $scope.movie.Plot, 
				api_key: 'dc6zaTOxFJmzC'
			}
		}).then(function(response) {
			console.log(response);
			$scope.giphys = response.data.data;
		})
	})

});

