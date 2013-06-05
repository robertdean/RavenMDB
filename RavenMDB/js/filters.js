'use strict';

/* Filters */
angular.module('app.filters', [])
    .filter('titleize', [function () {
        return function (text) {
            return _.str.titleize(text);
        };
    }])
    .filter('toSentenceSerial', [function () {
        return function (textArray) {
            return _.str.toSentenceSerial(textArray);
        };
    }])
    .filter('humanize', [function () {
        return function (text) {
            return _.str.humanize(text);
        };
    }])
    .filter('truncate', [function () {
        return function (text, limit) {
            return _.str.truncate(text, limit);
        };
    }])
    .filter('rangefacet', [function () {
        return function(text) {
            return text.replace(/Dx|\[|\]/g, "");
        };
    }]);

