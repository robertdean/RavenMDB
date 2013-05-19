'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');

angular.module('myApp.services', []).
  factory('MovieService',
      ['$http', function ($http) {          
          return {
              search: function(query) {
                  console.log('Test');
                  return $http({
                      url: "/api/movie/",
                      method: "POST",
                      data: query,
                      headers: { 'Content-Type': 'application/json' }
                  });
              },
              fetchTitle: function (id) {
                  return $http({
                      url: "/api/movie/" + id,
                      method: "GET",
                      headers: { 'Content-Type': 'application/json' }
                  });
              },
              saveChanges: function (title) {
                  console.log(title);
                  return $http({
                      url: "/api/movie/" + title.id,
                      method: "GET",
                      headers: { 'Content-Type': 'application/json' }
                  });
              },
          };
      }]);
