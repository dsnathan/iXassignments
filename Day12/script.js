var app = angular.module('chommiesApp', ['ngRoute']); 
app.config(function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'FeedCtrl',
        templateUrl: 'templates/feed.html'
    })
    $routeProvider.when('/me', {
        controller: 'MeCtrl',
        templateUrl: 'templates/me.html',
    })
});
app.controller('FeedCtrl', function($scope, $http) {
    $scope.isSending = false;
    $scope.newPropsValue = "";
    $scope.getProps = function(){
    $http({
        url: 'http://ixchommies.herokuapp.com/props',
        method: 'GET',
        params: {
            token: '4a97be3cf346f9f3816a0932f783bc03',
        }
    }).then(function(response) {
        console.log(response);
        $scope.props = response.data;
    })
};
    $http({
        url: 'http://ixchommies.herokuapp.com/brus',
        method: 'GET',
        params: {
            token: '4a97be3cf346f9f3816a0932f783bc03',
        }
    }).then(function(response) {
        console.log(response);
        $scope.brus = response.data;
    })
    $scope.sendProps = function(){
        $scope.isSending = true;
        $scope.errorMessage = "";
        console.log($scope.selectedBru);
        $http({
            url: "http://ixchommies.herokuapp.com/props",
            method: "POST",
            params: {
                "token": "4a97be3cf346f9f3816a0932f783bc03"
            },
            data: {
                "for": $scope.selectedBru,
                "props": $scope.newPropsValue
            }
        }).then(function(response){
            $scope.newPropsValue = "";
            $scope.getProps();
        }).catch(function(response){
            console.log(response);
            $scope.errorMessage = response.data.message;
        }).finally(function(response){
            $scope.isSending = false;
        })
    };
        $scope.getProps();
    });
        app.controller('MeCtrl', function($scope, $http){
            $http({
                url: "http://ixchommies.herokuapp.com/props/me",
                method: "GET",
                params: {
                    token: "4a97be3cf346f9f3816a0932f783bc03"
                }
            }).then(function(response){
                console.log(response);
                $scope.props = response.data;
            })
        });

