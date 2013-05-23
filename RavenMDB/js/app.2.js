'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/', { templateUrl: 'partials/search.html', controller: 'SearchCtrl' });
      $routeProvider.when('/title/:id', { templateUrl: 'partials/titleview.html', controller: 'TitleCtrl' });
      $routeProvider.when('/title/:id/edit', { templateUrl: 'partials/editTitle.html', controller: 'EditTitleCtrl' });
      $routeProvider.when('/404', { templateUrl: 'partials/404.html', controller: 'ErrorCtrl' });
      $routeProvider.otherwise({redirectTo: '/404'});
  }]);
