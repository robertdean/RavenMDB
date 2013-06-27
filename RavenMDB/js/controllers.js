'use strict';
/* Controllers */
angular.module('app.controllers', ['ngSanitize'])
    .controller('DetailsCtrl', ['$scope', '$routeParams', 'SearchService', function ($scope, $routeParams, SearchService) {
        $scope.service = SearchService;
        $scope.service.find($routeParams.id);        
    }])
    .controller('ResultsCtrl', ['$scope', 'SearchService', function ($scope, SearchService) {
        $scope.service = SearchService;
        $scope.$watch('service.currentPage', function (newValue, oldValue, scope) {
            if (newValue != oldValue) {
                $scope.service.search();
            }
        });

        $scope.$watch('service.selectedFacets.length', function (newValue, oldValue, scope) {
            if (newValue != oldValue) {
                $scope.service.search();
            }
        });
    }]);