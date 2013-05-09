'use strict';

/* Services */
angular.module('myApp.services', []).
  factory('Search', ['$http', function ($http) {
      return $http.get("/api/?q=life");
  }]);

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');
