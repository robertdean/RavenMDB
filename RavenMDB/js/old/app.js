'use strict';
// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/', { templateUrl: 'partials/search.html', controller: 'ResultsCtrl' });
      $routeProvider.when('/test', { templateUrl: 'partials/test.html', controller: 'DetailsCtrl' });
      $routeProvider.when('/title/:id', { templateUrl: 'partials/details.html', controller: 'DetailsCtrl' });
    $routeProvider.otherwise({redirectTo: '/'});
} ]).run(['SearchService',function(SearchService){
    SearchService.search("");
}]);
