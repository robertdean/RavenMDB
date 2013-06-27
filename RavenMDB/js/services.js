'use strict';

angular.module('app.services', [])
    .factory('SearchService', ['$http', function($http) {
        var self = this;
        self.processingIndicatorStatus = false;
        var service = {};
        service.currentTitle = {};
        service.statistics = {};
        service.pageSize = 10;
        service.currentPage = 1;
        self.totalHits = 0;
        service.searchTerms = "";
        service.errorMessage = "";
        service.suggestions = [];
        service.facets = [];
        service.selectedFacets = [];
        service.results = [];
        service.buildId = "";
        
        service.find = function(id) {
            $http
                .get("/api/movie/" + id)
                .success(function(data) {
                    console.log(data);
                    service.currentTitle = data;
                });
        };
        
        service.search = function() {
            self.processingIndicatorStatus = true;
            var req = $http.post("api/movie", {
                q: service.searchTerms,
                facets: service.selectedFacets,
                currentPage: service.currentPage,
                pageSize: service.pageSize
            });

            req.success(function(data, status) {
                self.totalHits = data.Stats.TotalResults;
                service.statistics = data.Stats;
                service.suggestions = data.Suggestions;
                service.facets = data.FacetedResults;
                service.selectedFacets = data.FacetedFilterApplied;
                service.results = data.TitlesFound;
                service.buildId = data.BuildId;
                self.processingIndicatorStatus = false;
            });
        };

    service.processing = function () {
        return self.processingIndicatorStatus;
    };

    service.totalPages = function () {
        if (!self.totalHits || (self.totalHits == 0))
            return 0;
        var pageCount = (Math.floor(self.totalHits / service.pageSize));
        if (self.totalHits % service.pageSize != 0) pageCount++;
        return pageCount;
    };

    service.facetIsApplied = function (facetName, facetFilterValue) {
        for (var i = 0; i < service.selectedFacets.length; i++) {
            if (service.selectedFacets[i].facetName == facetName && service.selectedFacets[i].facetFilterValue == facetFilterValue) {
                return true;
            }
        }
        return false;
    };

    service.addFacet = function (facetName, facetFilterValue) {
        var removing = false;
        for (var i = 0; i < service.selectedFacets.length; i++) {
            if (service.selectedFacets[i].facetName == facetName && service.selectedFacets[i].facetFilterValue == facetFilterValue) {
                service.selectedFacets.splice(i, 1);
                removing = true;
            }
        }
        if (!removing)
            service.selectedFacets.push({ facetName: facetName, facetFilterValue: facetFilterValue });
    };

        service.removeFacet = function(facetName, facetFilterValue) {
            for (var i = 0; i < service.selectedFacets.length; i++) {
                if (service.selectedFacets[i].facetName == facetName && service.selectedFacets[i].facetFilterValue == facetFilterValue) {
                    service.selectedFacets.remove(service.selectedFacets[i]);
                }
            }
        };
        return service;
    }]);
