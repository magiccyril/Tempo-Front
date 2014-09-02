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

    $scope.calendarEvents = [];

    $scope.changeMonth = function (momentDate) {
      $scope.calendarDate   = momentDate;
      $scope.previousMonth  = moment(momentDate).subtract(1, 'month');
      $scope.nextMonth      = moment(momentDate).add(1, 'month');
    };

    $scope.changeMonth(moment());
  });
