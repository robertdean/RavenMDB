'use strict';

/* Services */
angular.module('myApp.services', [])
    .service('SearchService', ['$http', function ($http) {
        var results;
        var currentTitle;
        var currentPage;
        var selectedFacets=[];
        var searchTerms;
        var processing=false;
        
        var searchService = {
            processing: function(){
                return processing;
            },
            setFacet: function(facet,facetValue){
                console.log(facet);
                console.log(facetValue);
                selectedFacets.push({ facet: facet.Name, selectedValue: facetValue.Range });
            },
            removeFacet: function(facet,facetValue){
                
            },
            setResults: function (data) {
                results = data;
            },
            getResults: function () {
                return results;
            },
            find:function(id) {
                processing=true;
                var req = $http.get("api/movie/"+id);
                req.success(function (data) {
                    currentTitle = data;
                    processing = false;
                });
            },
            currentTile: function() {
                return currentTitle;
            },
            search: function (terms) {
                processing=true;
                var req = $http.post("api/movie", {
                    q: terms,
                    facets: selectedFacets,
                    currentPage: 1,
                    pageSize: 10
                });
                req.success(function (data) {
                    processing=false;
                    results = data;
                });
            }
        };

        return searchService;

    }]);
