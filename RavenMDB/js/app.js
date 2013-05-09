'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/search.html', controller: 'MyCtrl1'});
    $routeProvider.when('/title/:id', {templateUrl: 'partials/titleview.html', controller: 'MyCtrl2'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
