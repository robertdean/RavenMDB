'use strict';

/* Services */
angular.module('myApp.services', [])
    .service('SearchService', ['$http', function ($http) {
        var results;
        var currentTitle;
        var currentPage;
        var searchTerms;
        
        var searchService = {
            setResults: function (data) {
                results = data;
            },
            getResults: function () {
                return results;
            },
            find:function(id) {
                var req = $http.get("api/movie/"+id);
                req.success(function (data) {
                    currentTitle = data;
                });
            },
            currentTile: function() {
                return currentTitle;
            },
            search: function (terms) {
                var req = $http.post("api/movie", {
                    q: terms,
                    facets: [],
                    currentPage: 1,
                    pageSize: 10
                });
                req.success(function (data) {
                    results = data;
                });
            }
        };

        return searchService;

    }]);
