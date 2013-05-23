'use strict';

/* Directives */
angular.module('myApp.directives', [])
    .directive('eatClick', function () {
        return function (scope, element, attrs) {
            $(element).click(function (event) {
                event.preventDefault();
            });
        };
    })
    .directive('navBar', [function () {
        return {
            restrict: "E",
            transclude: true,
            templateUrl: 'partials/directives/navBar.html'
        };
    }])
    .directive('searchBox', ['SearchService', function (SearchService) {        
        return {
            restrict: "E",
            link: function (scope, element, attributes) {
                scope.processing  = function(){
                      return SearchService.processing();
                };
                scope.submit = function () {
                    SearchService.search(scope.searchTerms);
                    
                };
            },
            templateUrl: 'partials/directives/searchBox.html'
        };
    }]);

