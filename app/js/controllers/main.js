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

    $scope.onCalendarTypeClick = function () {
      $scope.showCalendarType = !$scope.showCalendarType;
    };
    $scope.onCalendarTypeChange = function () {
      $scope.showCalendarType = false;
    };
    $scope.calendarTypeFormat = function (type) {
      switch (type) {
        case 'tempo':
          return 'Tempo';

        case 'ejp-north':
          return 'EJP Nord';

        case 'ejp-paca':
          return 'EJP PACA';

        case 'ejp-west':
          return 'EJP Ouest';

        case 'ejp-south':
          return 'EJP Sud';
      }
    };

    $scope.changeMonth = function (momentDate) {
      $scope.calendarDate   = momentDate;
      $scope.previousMonth  = moment(momentDate).subtract(1, 'month');
      $scope.nextMonth      = moment(momentDate).add(1, 'month');
      $scope.previousYear   = moment(momentDate).subtract(1, 'year');
      $scope.nextYear       = moment(momentDate).add(1, 'year');
      $scope.today          = moment();
    };

    $scope.showCalendarType = false;
    $scope.calendarType     = 'tempo';
    $scope.changeMonth(moment());
    $scope.calendarEvents   = [];
  });
