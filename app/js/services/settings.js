'use strict';

/**
 * @ngdoc service
 * @name tempoApp.Settings
 * @description
 */
angular
  .module('tempoApp')
  .factory('Settings', ['$rootScope', function ($rootScope) {
    var themeColor = '#006687';
    var themeCSS = 'site-title-blue';

    function getThemeColor() {
      return themeColor;
    }
    function setThemeColor (color) {
      switch (color) {
        case 'red':
          themeColor = '#d32a0e';
          break;

        case 'white':
          themeColor = '#cecece';
          break;

        default:
          themeColor = '#006687';
      }

      $rootScope.$broadcast('themeColorUpdate');

      return themeColor;
    }

    function getThemeCSS() {
      return themeCSS;
    }
    function setThemeCSS (color) {
      switch (color) {
        case 'red':
          themeCSS = 'site-title-red';
          break;

        case 'white':
          themeCSS = 'site-title-white';
          break;

        default:
          themeCSS = 'site-title-blue';
      }

      $rootScope.$broadcast('themeCSSUpdate');

      return themeCSS;
    }

    return {
      themeColor: {
        get: getThemeColor,
        set: setThemeColor
      },
      themeCSS: {
        get: getThemeCSS,
        set: setThemeCSS
      }
    };
  }]);
