'use strict';

/**
 * @ngdoc service
 * @name tempoApp.forecast
 * @description
 * # tempo
 * Factory in the tempoApp.
 */
angular.module('tempoApp')
  .constant('FORECAST_API_URL', 'http://411279a3a8.url-de-test.ws')
  .factory('Forecast', ['$http', '$q', 'FORECAST_API_URL',
    function ($http, $q, FORECAST_API_URL) {
      var formatTempoData = function (data) {
        switch (data) {
          case 'blue':
            return 'Bleu';

          case 'white':
            return 'Blanc';

          case 'red':
            return 'Rouge';
        }
      };

      var fetch = function () {
        return $http.get(FORECAST_API_URL + '/forecast')
          .then(function (response) {
            var data = response.data;

            var formatedData = {
              'today': {
                'tempo': null,
                'ejp': {
                  'north': null,
                  'paca': null,
                  'west': null,
                  'south': null
                }
              },
              'tomorrow': {
                'tempo': null,
                'ejp': {
                  'north': null,
                  'paca': null,
                  'west': null,
                  'south': null
                }
              }
            };

            if (data.today && data.today.tempo) {
              formatedData.today.tempo = {
                raw: data.today.tempo.color,
                format: formatTempoData(data.today.tempo.color)
              };
            }

            if (data.tomorrow && data.tomorrow.tempo) {
              formatedData.tomorrow.tempo = {
                raw: data.tomorrow.tempo.color,
                format: formatTempoData(data.tomorrow.tempo.color)
              };
            }

            return formatedData;
          });
      };

      return {
        'fetch': fetch
      };
    }
  ]);
