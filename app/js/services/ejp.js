'use strict';

/**
 * @ngdoc service
 * @name tempoApp.tempo
 * @description
 * # tempo
 * Factory in the tempoApp.
 */
angular.module('tempoApp')
  .constant('EJP_API_URL', 'http://api.tempo.18ruedivona.eu')
  .constant('EJP_API_FROM_MONTH', 10)
  .constant('EJP_API_FROM_DAY', 1)
  .constant('EJP_API_COUNT', 22)
  .factory('EJP', [
    '$http',
    '$q',
    'EJP_API_URL',
    'EJP_API_FROM_MONTH',
    'EJP_API_FROM_DAY',
    'EJP_API_COUNT',
    function ($http, $q, EJP_API_URL, EJP_API_FROM_MONTH, EJP_API_FROM_DAY, EJP_API_COUNT) {
      var getCounter = function () {
        var fromDate = moment();
        fromDate.month(EJP_API_FROM_MONTH - 1);
        fromDate.date(EJP_API_FROM_DAY);

        return $http.get(EJP_API_URL + '/ejp/count/' + fromDate.format('YYYY-MM-DD')).then(function (response) {
            return {
              'north': EJP_API_COUNT - response.data.north,
              'paca': EJP_API_COUNT - response.data.paca,
              'west': EJP_API_COUNT - response.data.west,
              'south': EJP_API_COUNT - response.data.south
            };
          });
      };

      var getZoneMonth = function (zone, date) {
        return $http.get(EJP_API_URL + '/ejp/' + date.format('YYYY-MM'))
          .then(function (response) {
            var data = response.data;

            var formatedData = {};
            for (var i = 0; i < data.length; i++) {
              var day = data[i];
              var dayDate = moment(day.date.year + '-' + day.date.month + '-' + day.date.day, 'YYYY-M-D');

              var raw = day.zones[zone];
              var format = day.zones[zone] ? 'EJP' : '';

              formatedData[dayDate.format('YYYY-MM-DD')] = {
                raw: raw,
                format: format
              };
            }

            return formatedData;
          });
      };

      return {
        'getCounter': getCounter,
        'getMonth': getZoneMonth
      };
    }
  ]);
