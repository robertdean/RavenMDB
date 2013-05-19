'use strict';
/* Controllers */

angular.module('myApp.controllers', ['ngSanitize'])
    .controller('SearchCtrl',['$scope','$routeParams','MovieService', function($scope, $rootScope, $routeParams, MovieService) {
        $scope.searchResults = $rootScope.searchResults;
        $scope.pageSize = 10;
        $scope.showProcessingIcon = false;
        $scope.searchTerms = "";
        $scope.currentPage = 1;
        $scope.errorMessage = null;

        $scope.init = function() {
            if ($scope.showProcessingIcon && !$scope.searchResults) {
                $scope.submitRequest();
            }
        };

        $scope.setPage = function(newPageNumber) {
            $scope.currentPage = newPageNumber;
            $scope.submitRequest();
        };

        $scope.totalPages = function() {

            if (!$scope.searchResults) return 1;

            return $rootScope.searchResults.Stats.TotalResults;
        };

        $scope.selectSuggestion = function(suggestion) {
            $scope.searchTerms = suggestion;
            $scope.submitRequest();
        };

        $scope.selectedFacets = [];

        $scope.setFacet = function(parent, selectedValue) {
            $scope.selectedFacets.push({ facet: parent.Name, selectedValue: selectedValue.Range });
            $scope.submitRequest();
        };

        $scope.removeFacet = function(facet) {
            var facetToRemove = $scope.selectedFacets[facet];
            $scope.selectedFacets.splice(facetToRemove, 1);
            $scope.submitRequest();
        };

        $scope.submitRequest = function() {
            $scope.showProcessingIcon = true;
            MovieService
                .search({
                    q: $scope.searchTerms,
                    facets: $scope.selectedFacets,
                    currentPage: $scope.currentPage,
                    pageSize: $scope.pageSize
                })
                .success(function(data, status, headers, config) {

                    $rootScope.searchResults = data;
                    $scope.searchResults = data;
                    $scope.showProcessingIcon = false;
                    return data;

                })
                .error(function(data, status, headers, config) {
                    $scope.errorMessage = data.Message;
                    $scope.showProcessingIcon = false;
                    return status;
                });
        };
    }])
    .controller('TitleCtrl', ['$scope', '$routeParams', 'MovieService', function ($scope, $routeParams, MovieService) {
      MovieService.fetchTitle($routeParams.id)
          .success(function (data) {
            $scope.currentTitle = data;            
        });
    }])
    .controller('EditTitleCtrl',['$scope','$routeParams','MovieService', function($scope, $routeParams, MovieService) {
        MovieService.fetchTitle($routeParams.id)
            .success(function (data) {
                $scope.currentTitle = data;
                console.log($scope.currentTitle);
            });
        $scope.saveChanges = function(title) {
            MovieService.saveChanges(title)
                .success(function (data) {
                    console.log(data);
                });
        };
    }])
    .controller('ErrorCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
            
    }]);