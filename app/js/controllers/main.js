'use strict';

/**
 * @ngdoc function
 * @name tempoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tempoApp
 */
angular.module('tempoApp')
  .controller('MainCtrl', ['$scope', 'Forecast', 'Tempo', 'EJP', function ($scope, Forecast, Tempo, EJP) {
    $scope.isOffPeak = function () {
      return ((moment().hours >= 0 && moment.hours < 6) || (moment().hours > 22 && moment.hours <= 23));
    };

    $scope.onCalendarTypeClick = function () {
      $scope.showCalendarType = !$scope.showCalendarType;
    };
    $scope.onCalendarTypeChange = function () {
      $scope.showCalendarType = false;
      $scope.calendarLoadData();
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

    $scope.calendarLoadData = function () {
      switch ($scope.calendarType) {
        case 'tempo':
          Tempo.getMonth($scope.calendarDate).then(function (data) {
            $scope.calendarEvents = data;
          });
          break;

        case 'ejp-north':
          EJP.getMonth('north', $scope.calendarDate).then(function (data) {
            $scope.calendarEvents = data;
          });
          break;

        case 'ejp-paca':
          EJP.getMonth('paca', $scope.calendarDate).then(function (data) {
            $scope.calendarEvents = data;
          });
          break;

        case 'ejp-west':
          EJP.getMonth('west', $scope.calendarDate).then(function (data) {
            $scope.calendarEvents = data;
          });
          break;

        case 'ejp-south':
          EJP.getMonth('south', $scope.calendarDate).then(function (data) {
            $scope.calendarEvents = data;
          });
          break;
      }
    };

    $scope.changeMonth = function (momentDate) {
      $scope.calendarDate   = momentDate;
      $scope.previousMonth  = moment(momentDate).subtract(1, 'month');
      $scope.nextMonth      = moment(momentDate).add(1, 'month');
      $scope.previousYear   = moment(momentDate).subtract(1, 'year');
      $scope.nextYear       = moment(momentDate).add(1, 'year');
      $scope.today          = moment();

      $scope.calendarLoadData();
    };

    $scope.showCalendarType = false;
    $scope.calendarType     = 'tempo';
    $scope.changeMonth(moment());
    $scope.calendarEvents   = [];

    $scope.todayDate        = moment();
    $scope.tomorrowDate     = moment().add(1, 'days');
    if (moment().hours > 0 && moment.hours < 6) {
      $scope.todayDate.subtract(1, 'days');
      $scope.tomorrowDate.subtract(1, 'days');
    }

    Tempo.getCounter().then(function (data) {
      $scope.tempoCounter = data;
    });

    EJP.getCounter().then(function (data) {
      $scope.ejpCounter = data;
    });

    Forecast.fetch().then(function (data) {
      $scope.forecast = data;
    });
  }]);
