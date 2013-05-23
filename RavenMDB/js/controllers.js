'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngSanitize'])
    .controller('ResultsCtrl', ['$scope', 'SearchService', function ($scope, SearchService) {
        $scope.results = SearchService.getResults;
    }])
    .controller('SearchCtrl', ['$scope', 'SearchService', function ($scope, SearchService) { }])
    .controller('DetailsCtrl', ['$scope', 'SearchService', function ($scope, SearchService) { }])
    .controller('TitleCtrl', ['$scope', '$routeParams', 'MovieService', function ($scope, $routeParams, MovieService) {
        MovieService.fetchTitle($routeParams.id)
            .success(function (data) {
                $scope.currentTitle = data;
            });
    }])
    .controller('EditTitleCtrl', ['$scope', '$routeParams', 'MovieService', function ($scope, $routeParams, MovieService) {
        MovieService.fetchTitle($routeParams.id)
            .success(function (data) {
                $scope.currentTitle = data;
                console.log($scope.currentTitle);
            });
        $scope.saveChanges = function (title) {
            MovieService.saveChanges(title)
                .success(function (data) {
                    console.log(data);
                });
        };
    }])
    .controller('ErrorCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {

    }]);