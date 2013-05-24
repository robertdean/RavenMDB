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
    .directive('suggestionControl',['SearchService', function(SearchService) {
        return {
            scope: {
                suggestion: "="
            },
            restrict: "E",
            templateUrl: "partials/directives/suggestion.html",
            link: function(scope, element, attributes) {
                    scope.setSuggestion = function(suggestion) {
                        SearchService.searchTerms = suggestion;
                        SearchService.search(suggestion);
                    };
            }
        };
    }])
    .directive('facetControl',['SearchService',function(SearchService) {
        return {
            scope: {
                facet: "="
            },
            restrict: "E",
            templateUrl: "partials/directives/facet.html",
            link: function(scope, element, attributes) {
                scope.setFacet = function(facet, facetValue) {
                    SearchService.setFacet(facet, facetValue);
                };
            }
        };
    }])
    .directive('pagination', ['SearchService', function (SearchService) {
        return {
            scope: {
                totalPages: "=",
                currentPage: "="
            },
            restrict: "E",
            link: function (scope, element, attributes) {
                scope.pages = function () {                    
                    return SearchService.getPages();
                };
                scope.currentPage = function() {
                    return SearchService.getCurrenPage();
                };
                
                scope.totalRecords = function () {
                    return SearchService.totalRecords();
                };
                
                
            },
            templateUrl: 'partials/directives/pagination.html'
        };
    }])
    .directive('searchBox', ['SearchService', function (SearchService) {        
        return {
            restrict: "E",
            link: function (scope, element, attributes) {
                scope.searchTerms = SearchService.searchTerms;
                scope.processing = function () {
                      return SearchService.processing();
                };
                scope.submit = function () {
                    SearchService.search(scope.searchTerms);
                };
            },
            templateUrl: 'partials/directives/searchBox.html'
        };
    }]);

