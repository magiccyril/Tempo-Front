'use strict';

/**
 * @ngdoc function
 * @name tempoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tempoApp
 */
angular.module('tempoApp')
  .controller('HeadCtrl', ['$scope', 'Settings', function ($scope, Settings) {
    $scope.$on('themeColorUpdate', function () {
      $scope.themeColor = Settings.themeColor.get();
    });
  }]);
