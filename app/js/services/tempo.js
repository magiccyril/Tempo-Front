'use strict';

/**
 * @ngdoc service
 * @name tempoApp.tempo
 * @description
 * # tempo
 * Factory in the tempoApp.
 */
angular.module('tempoApp')
  .constant('TEMPO_API_URL', 'http://411279a3a8.url-de-test.ws')
  .constant('TEMPO_API_FROM_MONTH', 9)
  .constant('TEMPO_API_FROM_DAY', 1)
  .constant('TEMPO_API_COUNT_BLUE', 300)
  .constant('TEMPO_API_COUNT_WHITE', 43)
  .constant('TEMPO_API_COUNT_RED', 22)
  .factory('Tempo', [
    '$http',
    '$q',
    'TEMPO_API_URL',
    'TEMPO_API_FROM_MONTH',
    'TEMPO_API_FROM_DAY',
    'TEMPO_API_COUNT_BLUE',
    'TEMPO_API_COUNT_WHITE',
    'TEMPO_API_COUNT_RED',
    function ($http, $q, TEMPO_API_URL, TEMPO_API_FROM_MONTH, TEMPO_API_FROM_DAY, TEMPO_API_COUNT_BLUE, TEMPO_API_COUNT_WHITE, TEMPO_API_COUNT_RED) {
      var cacheMonth = {};

      var formatData = function (data) {
        switch (data) {
          case 'blue':
            return 'Bleu';

          case 'white':
            return 'Blanc';

          case 'red':
            return 'Rouge';
        }
      };

      var getCounter = function () {
        var fromDate = moment();
        fromDate.month(TEMPO_API_FROM_MONTH - 1);
        fromDate.date(TEMPO_API_FROM_DAY);

        if (moment().isLeapYear()) {
          TEMPO_API_COUNT_BLUE = TEMPO_API_COUNT_BLUE + 1;
        }

        return $http.get(TEMPO_API_URL + '/tempo/count/' + fromDate.format('YYYY-MM-DD'))
          .then(function (response) {
            return {
              'blue': TEMPO_API_COUNT_BLUE - response.data.blue,
              'white': TEMPO_API_COUNT_WHITE - response.data.white,
              'red': TEMPO_API_COUNT_RED - response.data.red
            };
          });
      };

      var getMonth = function (date) {
        var dateKey = date.format('YYYY-MM');

        if (cacheMonth[dateKey]) {
          var deferred = $q.defer();
          deferred.resolve(cacheMonth[dateKey]);
          return deferred.promise;
        }
        else {
          return $http.get(TEMPO_API_URL + '/tempo/' + dateKey)
            .then(function (response) {
              var data = response.data;

              var formatedData = {};
              for (var i = 0; i < data.length; i++) {
                var day = data[i];
                var dayDate = moment(day.date.year + '-' + day.date.month + '-' + day.date.day, 'YYYY-M-D');
                formatedData[dayDate.format('YYYY-MM-DD')] = {
                  'raw': day.color,
                  'formated': formatData(day.color)
                };
              }

              cacheMonth[dateKey] = formatedData;
              return formatedData;
            });
        }
      };

      return {
        'getCounter': getCounter,
        'getMonth': getMonth
      };
    }
  ]);
