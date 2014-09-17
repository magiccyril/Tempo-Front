'use strict';

/**
 * @ngdoc service
 * @name tempoApp.tempo
 * @description
 * # tempo
 * Factory in the tempoApp.
 */
angular.module('tempoApp')
  .constant('TEMPO_API_URL', 'http://api.tempo.18ruedivona.eu')
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
      var cache = {};

      var formatColor = function (data) {
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
        fromDate.subtract(1, 'year');

        if (moment().month() + 1 >= TEMPO_API_FROM_MONTH) {
          fromDate.add(1, 'year');
        }

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

      var formatData = function (data) {
        var formatedData = {};

        angular.forEach(data, function(item) {
          var dayDate = moment(item.date.year + '-' + item.date.month + '-' + item.date.day, 'YYYY-M-D');
          formatedData[dayDate.format('YYYY-MM-DD')] = {
            'raw': item.color,
            'formated': formatColor(item.color)
          };
        });

        return formatedData;
      };

      var fetch = function (date) {
        if (cache[date]) {
          var deferred = $q.defer();
          deferred.resolve(cache[date]);
          return deferred.promise;
        }

        return $http.get(TEMPO_API_URL + '/tempo/' + date)
          .then(function (response) {
            cache[date] = formatData(response.data);
            return cache[date];
          });
      };

      var save = function (apikey, date, color) {
        if (!date.isValid()) {
          return $q.reject('Invalid date');
        }

        if ('blue' !== color && 'white' !== color && 'red' !== color) {
          return $q.reject('Invalid color');
        }

        var data = {
          'year': date.format('YYYY'),
          'month': date.format('M'),
          'day': date.format('D'),
          'color': color
        };

        return $http.post(TEMPO_API_URL + '/tempo?apikey=' + apikey, data);
      };

      return {
        'getCounter': getCounter,
        'getMonth': function (date) {
          return fetch(date.format('YYYY-MM'));
        },
        'getYear': function (date) {
          return fetch(date.format('YYYY'));
        },
        'save': save
      };
    }
  ]);
