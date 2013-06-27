'use strict';

var app = angular.module('app',
        ['ui', 'ui.bootstrap', 'app.filters', 'app.services', 'app.directives', 'app.controllers'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', { templateUrl: 'partials/results.html', controller: 'ResultsCtrl' });
        $routeProvider.when('/test', { templateUrl: 'partials/test.html', controller: 'DetailsCtrl' });
        $routeProvider.when('/title/:id', { templateUrl: 'partials/details.html', controller: 'DetailsCtrl' });
        $routeProvider.otherwise({ redirectTo: '/' });
    }])
    .run(['SearchService',function(SearchService){
        SearchService.search();
    }]);