var app = angular.module('tensionApp', ["ngRoute", 'firebase']);

app.run(["$rootScope", "$location", function($rootScope, $location) {
	$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
    	$location.path("/");
    }
});
}]);

app.config(function($routeProvider) {
	$routeProvider.when('/list', {
		controller: 'ListCtrl',
		templateUrl: 'templates/list.html',
		resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      "currentAuth": function($firebaseAuth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return $firebaseAuth().$requireSignIn();
    }
}
})
	$routeProvider.when('/channel/:channelID', {
		controller: 'ChannelCtrl',
		templateUrl: 'templates/channel.html',
		resolve: {
      // controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      "currentAuth": function($firebaseAuth) {
        // $requireSignIn returns a promise so the resolve waits for it to complete
        // If the promise is rejected, it will throw a $stateChangeError (see above)
        return $firebaseAuth().$requireSignIn();
    }
}
})
	$routeProvider.when('/signup', {
		controller: 'SignCtrl',
		templateUrl: 'templates/signup.html',
	})
	$routeProvider.when('/', {
		controller: 'LoginCtrl',
		templateUrl: 'templates/login.html',
	})
});

app.controller("ListCtrl", function($scope, $firebaseObject, $firebaseArray) {
	var ref = firebase.database().ref().child("channels");
	$scope.channels = $firebaseObject(ref);
	$scope.newChannel = function()
	{
		$scope.channels.$add({
			"id": $scope.newChannelName,
			"created_at": Date.now()
		});
	}
	$scope.signUserOut = function () {
		firebase.auth().signOut().then(function() {
			window.location = "/";
		}, function(error) {
			console.log(error);
		});
	};
});

app.controller("ChannelCtrl", function($scope, $firebaseObject, $firebaseArray, $routeParams, $firebaseAuth) {
	$scope.authObj = $firebaseAuth();
	var authData = $scope.authObj.$getAuth();
	$scope.channelID = $routeParams.channelID;
	var ref = firebase.database().ref().child("messages").child($routeParams.channelID);
	var userRef = firebase.database().ref().child('users');
	$scope.user = $firebaseObject(userRef);
	$scope.messages = $firebaseArray(ref);
	$scope.newMessage = function(){
		$scope.messages.$add({
			"sender": authData.uid,
			"text": $scope.newMessageText,
			"created_at": Date.now()
		});
		$scope.messageText = "";
	};
});

app.controller("SignCtrl", function($scope, $firebaseAuth, $firebaseObject, $firebaseArray, $routeParams) {
	$scope.authObj = $firebaseAuth();
	$scope.signUp = function(){
		$scope.authObj.$createUserWithEmailAndPassword($scope.email, $scope.password)
		.then(function(firebaseUser) {
			console.log("User " + firebaseUser.uid + " created successfully!");
			var ref = firebase.database().ref().child('users').child(firebaseUser.uid);
			$scope.user = $firebaseObject(ref);
			$scope.user.name = $scope.name;
			$scope.user.email = $scope.email;
			$scope.user.$save();
		}).catch(function(error) {
			console.error("Error: ", error);
			document.getElementById("errorMsg").innerHTML = error.message;
		});
	};
});

app.controller("LoginCtrl", function($scope, $firebaseAuth, $routeParams, $firebaseObject, $firebaseArray) {
	$scope.authObj = $firebaseAuth();
	$scope.login = function() {
		$scope.error = false;
		$scope.authObj.$signInWithEmailAndPassword($scope.email, $scope.password).then(function(firebaseUser) {
			console.log("Signed in as:", firebaseUser.uid);

			var userRef = firebase.database().ref().child('users').child(firebaseUser.uid);
			$scope.user = $firebaseObject(userRef);
			console.log($scope.user);
			console.log($scope.user.name);

			window.location = "#/list";

			console.log($scope.authObj);
			console.log(firebase.auth());

		}).catch(function(error) {
			console.error("Authentication failed:", error);
			document.getElementById("logInErrorMsg").innerHTML = error.message;
		});
	}
});