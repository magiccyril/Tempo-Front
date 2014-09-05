'use strict';

/**
 * @ngdoc service
 * @name tempoApp.tempo
 * @description
 * # tempo
 * Factory in the tempoApp.
 */
angular.module('tempoApp')
  .constant('TEMPO_API_URL', '')
  .constant('TEMPO_API_FROM_MONTH', 9)
  .constant('TEMPO_API_FROM_DAY', 1)
  .factory('Tempo', ['$http', '$q', 'TEMPO_API_URL', 'TEMPO_API_FROM_MONTH', 'TEMPO_API_FROM_DAY'
  function($http, $q, TEMPO_API_URL, TEMPO_API_FROM_MONTH, TEMPO_API_FROM_DAY) {
    var getCounter = function () {
      var fromDate = moment();
      fromDate.month(TEMPO_API_FROM_MONTH - 1);
      fromDate.date(TEMPO_API_FROM_DAY);

      return $http.get(TEMPO_API_URL + '/tempo/count/' + fromDate.format('YYYY-MM-DD'));
    };

    var getMonth = function (date) {
      return $http.get(TEMPO_API_URL + '/tempo/' + date.format('YYYY-MM'))
        .then(function (response) {
          var data = response.data;

          var formatedData = {};
          for (var i = 0; i < data.length; i++) {
            var day = data[i];
            var dayDate = moment(day.date.year + '-' + day.date.month + '-' + day.date.day, 'YYYY-M-D');
            formatedData[dayDate.format('YYYY-MM-DD')] = day.color;
          }

          return formatedData;
        });
    };

    return {
      'getCounter': getCounter,
      'getMonth': getMonth
    };
  }
]);
