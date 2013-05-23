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
    .directive('facetControl',['SearchService',function(SearchService){
        return {
            scope:{
                facet: "="                
            },
            restrict: "E",
            templateUrl:"partials/directives/facet.html",
            link: function(scope,element, attributes){
                scope.setFacet = function(arg1,arg2){
                    console.log(arg1);
                };                
            }
        }
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

