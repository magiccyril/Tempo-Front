'use strict';

/**
 * @ngdoc function
 * @name tempoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tempoApp
 */
angular.module('tempoApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.calendarDate = new Date();
    $scope.calendarEvents = [];
  })
  .directive('divonaCalendar', function() {
    return {
      template: 'Hello calendar'
    };
  });;
