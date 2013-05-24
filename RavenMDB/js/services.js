'use strict';

/* Services */
angular.module('myApp.services', [])
    .service('SearchService', ['$http', function ($http) {
        var results;
        var currentTitle;
        var currentPage = 1;
        var currentPageSize = 10;
        var resultsFound = 0;
        var selectedFacets=[];
        var searchTerms;
        var processing = false;
        var pages = [];
            
        var fetchData = function(){
           var req = $http.post("api/movie", {
                    q: searchTerms,
                    facets: selectedFacets,
                    currentPage: currentPage,
                    pageSize: currentPageSize
                });
                req.success(function (data) {
                    processing=false;
                    results = data;                    
                    resultsFound = data.Stats.TotalResults;
                    prepPages();
                });  
        };

        var prepPages = function() {
            for (var i = 0; i < (resultsFound + 1) ; i++) {
                pages.push({
                    pageNumber: (i + 1),
                    isActive: false
                });
            }
        };
        
        var searchService = {

            processing: function () {
                return processing;
            },

            getPages: function (){
                return pages;
            },
            
            totalRecords: function() {
                return resultsFound;
            },
            
            setCurrentPage: function(pageNumber) {
                currentPage = pageNumber;
            },

            getCurrenPage: function () {
                return currentPage;
            },
            
            setPageSize: function(size) {
                currentPageSize = size;
            },
            
            getPageSize: function() {
                return currentPageSize;
            },
            
            setFacet: function(facet,facetValue){
                selectedFacets.push({ facet: facet.Name, selectedValue: facetValue.Range });
                fetchData();
            },
            
            removeFacet: function(facet,facetValue){
                //TODO: write facet removal logic
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

            currentTitle: function () {
                return currentTitle;
            },
            
            getSearchTerms: function() {
                return searchTerms;
            },
            
            search: function (terms) {
                processing=true;
                searchTerms =terms;
                fetchData();
            }

        };

        return searchService;

    }]);
