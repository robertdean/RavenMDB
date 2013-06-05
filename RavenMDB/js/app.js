'use strict';

var app = angular.module('app', ['ui', 'ui.bootstrap', 'app.filters', 'app.services', 'app.directives', 'app.controllers']);

angular.module('app.controllers', ['ngSanitize'])
    .controller('ctrl1', ['$scope', 'SearchService', function ($scope, SearchService) {
        $scope.service = SearchService;
    }])
    .controller('ctrl2', ['$scope', 'SearchService', function ($scope, SearchService) {
          $scope.service = SearchService;
          $scope.$watch('service.currentPage',function(newValue,oldValue,scope){
            if(newValue!=oldValue){
              $scope.service.search();
            }
          });

          $scope.$watch('service.selectedFacets.length', function (newValue, oldValue, scope) {
              if (newValue != oldValue) {
                  $scope.service.search();
              }
          });
}]);

