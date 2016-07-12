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
    $scope.newPropsValue = '',
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
    $scope.sendProps = function() {
        if ($scope.newPropsValue==="") {
            window.alert("Message cannot be empty");
            return;
        }
        console.log($scope.selectedBru);
        $http({
            type: 'GET',
            dataType: 'JSON',
            url: 'https://twinword-sentiment-analysis.p.mashape.com/analyze/',
            headers: {
                "X-Mashape-Key": "ng7kKOIpLSmshaHCoXDmXVEGTfy0p1o1XOzjsnEF7DrWI6shZv",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
            params: {
                callback: 'JSON_CALLBACK',
                "text": $scope.newPropsValue,
            }
        }).then(function(response){
            if (response.data.score <= .5) {
                window.alert("Message must be positive");
                $scope.newPropsValue = '';
            }
            else {
                $http({
                    url: 'http://ixchommies.herokuapp.com/props',
                    method: 'POST',
                    params: {
                        token: '4a97be3cf346f9f3816a0932f783bc03',
                    },
                    data: {
                        'for': $scope.selectedBru,
                        'props': $scope.newPropsValue,
                    }
                }).then(function(response) {
                    console.log(response);
                    $scope.newPropsValue = '';
                    $scope.getProps();
                })
            } 
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

