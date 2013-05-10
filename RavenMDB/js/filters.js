'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
      return function(text) {
          return String(text).replace(/\%VERSION\%/mg, version);
      };
  }])
    .filter('titleize', [function () {
        return function(text) {
            return _.str.titleize(text);
        };
    }])
    .filter('humanize', [function () {
        return function (text) {
            return _.str.humanize(text);
        };
    }])
    .filter('truncate', [function () {
        return function (text,limit) {
            return _.str.truncate(text,limit);
        };
    }]);



