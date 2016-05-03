var app = angular.module('myApp', ['ui.router']);
app.config(['$stateProvider', function($stateProvider) {
	$stateProvider
		.state('welcome', {
			url: '/welcome',

			controller: "testController1"
		})
		.state('list', {
			url: '/list',
			controller: "testController2"
		});
}]);

app.controller('testController', function($scope, $http, $state) {

});

app.controller('testController2', function($scope, $http, $state) {

});