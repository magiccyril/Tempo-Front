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
      var cache = {};

      var getCounter = function () {
        var fromDate = moment();
        fromDate.month(EJP_API_FROM_MONTH - 1);
        fromDate.date(EJP_API_FROM_DAY);
        fromDate.subtract(1, 'year');

        if (moment().month() + 1 >= EJP_API_FROM_MONTH) {
          fromDate.add(1, 'year');
        }

        return $http.get(EJP_API_URL + '/ejp/count/' + fromDate.format('YYYY-MM-DD')).then(function (response) {
            return {
              'north': EJP_API_COUNT - response.data.north,
              'paca': EJP_API_COUNT - response.data.paca,
              'west': EJP_API_COUNT - response.data.west,
              'south': EJP_API_COUNT - response.data.south
            };
          });
      };

      var formatData = function (response) {
        var data = response.data;

        var formatedData = {};
        for (var i = 0; i < data.length; i++) {
          var day = data[i];
          var dayDate = moment(day.date.year + '-' + day.date.month + '-' + day.date.day, 'YYYY-M-D');

          angular.forEach(day.zones, function(value, dayzone) {
            if (!formatedData[dayzone]) {
              formatedData[dayzone] = {};
            }

            var raw = value ? 'red' : 'white';
            var format = value ? 'EJP' : '';

            formatedData[dayzone][dayDate.format('YYYY-MM-DD')] = {
              'raw': raw,
              'formated': format
            };
          });
        }

        return formatedData;
      }

      var fetch = function (zone, date) {
        if (cache[date] && cache[date][zone]) {
          var deferred = $q.defer();
          deferred.resolve(cache[date][zone]);
          return deferred.promise;
        }
        else {
          return $http.get(EJP_API_URL + '/ejp/' + date)
            .then(function (response) {
              var formatedData = formatData(response);
              cache[date] = formatedData;

              return formatedData[zone];
            });
        }
      }


      var save = function (apikey, date, zones) {
        if (!date.isValid()) {
          return $q.reject('Invalid date');
        }

        var zonesValid = 'object' === typeof zones
          && 'boolean' === typeof zones.north
          && 'boolean' === typeof zones.paca
          && 'boolean' === typeof zones.west
          && 'boolean' === typeof zones.south;

        if (!zonesValid) {
          return $q.reject('Invalid zones');
        }

        var data = {
          'year': date.format('YYYY'),
          'month': date.format('M'),
          'day': date.format('D'),
          'zones': zones
        };

        return $http.post(EJP_API_URL + '/ejp?apikey=' + apikey, data);
      };

      return {
        'getCounter': getCounter,
        'getMonth': function (zone, date) {
          return fetch(zone, date.format('YYYY-MM'));
        },
        'getYear': function (zone, date) {
          return fetch(zone, date.format('YYYY'));
        }
      };
    }
  ]);
