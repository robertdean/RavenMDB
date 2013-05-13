'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngSanitize']).
    controller('MyCtrl1', ['$scope', '$rootScope','$routeParams', 'MovieService', function ($scope, $rootScope, $routeParams, MovieService) {

      $scope.searchResults = $rootScope.searchResults;
      $scope.showProcessingIcon = false;
      $scope.searchTerms = "";
      $scope.currentPage = 1;
      $scope.selectSuggestion = function (suggestion) {
          $scope.searchTerms = suggestion;
          $scope.submitRequest();
      };

      $scope.selectedFacets = [];
      $scope.setFacet = function (parent, selectedValue) {
          $scope.selectedFacets.push({ facet: parent.Name, selectedValue: selectedValue.Range });
          $scope.submitRequest();
      };

      $scope.removeFacet = function (facet) {
          var facetToRemove = $scope.selectedFacets[facet];
          $scope.selectedFacets.splice(facetToRemove,1);
          $scope.submitRequest();
      };

      $scope.submitRequest = function () {
          $scope.showProcessingIcon = true;
          MovieService.search({
              q: $scope.searchTerms,
              facets: $scope.selectedFacets,
              currentPage: $scope.currentPage
          }).success(function (data) {
              $rootScope.searchResults = data;
              $scope.searchResults = data;
              $scope.showProcessingIcon = false;
          });
      };

  } ])
  .controller('MyCtrl2', ['$scope','$routeParams', 'MovieService', function ($scope,  $routeParams, MovieService) {
      MovieService.fetchTitle($routeParams.id)
          .success(function (data) {
            $scope.currentTitle = data;
            console.log($scope.currentTitle);
        });
  } ]);