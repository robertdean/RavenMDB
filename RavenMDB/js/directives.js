'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
} ]);

angular.module('myApp.directives', []).
  directive('eatClick', function () {
      return function(scope, element, attrs) {
          $(element).click(function(event) {
              event.preventDefault();
          });
      };
  });

  angular.module('myApp.directives', [])
      .directive('eatClick', function () {
          return function(scope, element, attrs) {
              $(element).click(function(event) {
                  event.preventDefault();
              });
          };
      })