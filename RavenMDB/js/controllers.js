'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngSanitize']).
  controller('MyCtrl1', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
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
          $http({
              url: "/api/movie/",
              method: "POST",
              data: {
                  q: $scope.searchTerms,
                  facets: $scope.selectedFacets,
                  currentPage: $scope.currentPage
              },
              headers: { 'Content-Type': 'application/json' }
          }).success(function (data) {
              $scope.searchResults = data;
              $scope.showProcessingIcon = false;
          });


      };

  } ])
  .controller('MyCtrl2', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
      $http({
          url: "/api/movie/" + $routeParams.id,
          method: "GET",
          headers: { 'Content-Type': 'application/json' }
      }).success(function (data) {
          $scope.currentTitle = data;
          console.log($scope.currentTitle);
      });
  } ]);